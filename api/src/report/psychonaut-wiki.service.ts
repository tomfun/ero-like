import { Injectable } from '@nestjs/common';
import * as CachePolicy from 'http-cache-semantics';
import http from 'node:http';
import * as https from 'node:https';
import { Substance } from './psychonaut-wiki.types';

export { ReportDataBodyPayload, ReportEntity } from '../entity';

export type PsychonautWikiSubstanceForList = Pick<
  Substance,
  'name' | 'toxicity' | 'crossTolerances' | 'commonNames'
>;
type PsychonautWikiInteractionSubstance = Pick<Substance, 'name' | 'url'>;
export type PsychonautWikiSubstance = Omit<
  Substance,
  | 'effects'
  | 'experiences'
  | 'roa'
  | 'uncertainInteractions'
  | 'unsafeInteractions'
  | 'dangerousInteractions'
> &
  Record<
    | 'uncertainInteractions'
    | 'unsafeInteractions'
    | 'dangerousInteractions'
    | 'effects',
    PsychonautWikiInteractionSubstance
  >;
export type CacheItem = {
  cachePolicy: CachePolicy;
  substances: Array<PsychonautWikiSubstanceForList | PsychonautWikiSubstance>;
};

export const BODY_SINGLE = (name: string) =>
  JSON.stringify({
    operationName: null,
    variables: {},
    query: `{
    substances(query: ${JSON.stringify(name)}) {
        name
        url
        featured
        summary
        addictionPotential
        toxicity
        crossTolerances
        commonNames
    
        images {
            thumb
            image
        }

        class {
            chemical
            psychoactive
        }
        tolerance {
            full
            half
            zero
        }
        # routes of administration
        roas {
            name

            dose {
                units
                threshold
                heavy
                common { min max }
                light { min max }
                strong { min max }
            }

            duration {
                afterglow { min max units }
                comeup { min max units }
                duration { min max units }
                offset { min max units }
                onset { min max units }
                peak { min max units }
                total { min max units }
            }

            bioavailability {
                min max
            }
        }


        uncertainInteractions {
            name
            url
        }
        unsafeInteractions {
            name
            url
        }
        dangerousInteractions {
            name
            url
        }
        # subjective effects
        effects {
            name url
        }
    }
}
`,
  });

export const BODY_LIST = JSON.stringify({
  operationName: null,
  variables: {},
  query: `{
    substances(limit: 10) {
        name
        url
        featured
        summary
        addictionPotential
        toxicity
        crossTolerances
        commonNames
    
        images {
            thumb
            image
        }

        class {
            chemical
            psychoactive
        }
        tolerance {
            full
            half
            zero
        }
        # routes of administration
        roas {
            name

            dose {
                units
                threshold
                heavy
                common { min max }
                light { min max }
                strong { min max }
            }

            duration {
                afterglow { min max units }
                comeup { min max units }
                duration { min max units }
                offset { min max units }
                onset { min max units }
                peak { min max units }
                total { min max units }
            }

            bioavailability {
                min max
            }
        }


        uncertainInteractions {
            name
            url
        }
        unsafeInteractions {
            name
            url
        }
        dangerousInteractions {
            name
            url
        }
        # subjective effects
        effects {
            name url
        }
    }
}
`,
});

@Injectable()
export class PsychonautWikiService {
  private readonly cache = new Map<string, CacheItem>();
  private readonly requestAsyncCache = new Map<string, Promise<CacheItem>>();

  async getShortList(): Promise<PsychonautWikiSubstanceForList[]> {
    return (await this.request('/', BODY_LIST, '__list__')).substances;
  }

  async getSubstance(name: string) {
    return (await this.request('/', BODY_SINGLE(name), name)).substances[0];
  }

  private normalizeHeaders(
    headers: http.OutgoingHttpHeaders,
  ): CachePolicy.Headers {
    const result: CachePolicy.Headers = {};

    for (const key of Object.keys(headers)) {
      const value = headers[key];

      if (typeof value === 'number') {
        result[key] = value.toString();
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) => item.toString());
      } else if (typeof value === 'string') {
        result[key] = value;
      }
    }

    return result;
  }

  private request(path, body, key): Promise<CacheItem> {
    const freshRequest = this.requestAsyncCache.get(path);
    if (freshRequest) {
      return freshRequest;
    }
    const newRequest = new Promise<CacheItem>((res, rej) => {
      const cached = this.cache.get(key);
      let cachePolicyRequest: CachePolicy.Request;
      const request = https.request(
        {
          hostname: 'api.psychonautwiki.org',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (response) => {
          if (response.statusCode !== 200) {
            return rej(
              new Error(
                `psychonautwiki status is not OK: ${response.statusCode}`,
              ),
            );
          }

          const cachePolicyResponse = {
            status: response.statusCode,
            headers: this.normalizeHeaders(response.headers),
          };
          // Create a new CachePolicy with the request and response objects.
          const cachePolicy = new CachePolicy(
            cachePolicyRequest,
            cachePolicyResponse,
          );

          response.setEncoding('utf8');
          let dataStr = '';
          response.on('data', (chunk) => (dataStr += chunk));
          response.on('end', () => {
            const data: CacheItem = {
              cachePolicy,
              substances: JSON.parse(dataStr).data.substances,
            };
            this.cache.set(key, data);
            res(data);
          });
        },
      );

      cachePolicyRequest = {
        url: request.path,
        method: request.method,
        headers: this.normalizeHeaders(request.getHeaders()),
      };

      if (
        cached &&
        cached.cachePolicy.satisfiesWithoutRevalidation(cachePolicyRequest)
      ) {
        // Cancel request
        request.destroy(null);
        res(cached);
        return;
      }

      request.on('error', (e) => (cached ? res(cached) : rej(e)));

      // Write data to request body
      request.write(body);
      request.end();
    });

    this.requestAsyncCache.set(path, newRequest);
    const clear = () => this.requestAsyncCache.delete(path);
    newRequest.then(clear, clear);
    return newRequest;
  }
}
