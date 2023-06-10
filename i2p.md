# How to post from i2p
Security is important. Anonymity is required. Clear web is not safe. While we are doing
our best there are still weak points. We not use cookies and tracker like sentry or google
(at moment of writing this paragraph). But anyone should be able to send data fully 
anonymous by i2p or torr. This section is for advance users only.

You can find API documentation (on the main web site https://ero-like.online/api , in code,
i2p web site) and use it directly. Here we can find example of [creating](api/rest-api.http)
report or registering user. Here will be shown how to use `curl` with `proxy` configuration
to (simulate) create user:

```shell
curl 'https://ero-like.online/api/user/dry-run' \
  -X 'PATCH' \
  -H 'content-type: application/json' \
  --data-raw '{"publicKeyArmored":"-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n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\nYnVwv0HExONOngZ5Q1fQVYKA4yxDdN5qSIODBA==\n=cLep\n-----END PGP PUBLIC KEY BLOCK-----\n","clearSignArmored":"-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA256\n\nI read and agree with all terms of use of ero-like and confirm my registration on ero-like\n-----BEGIN PGP SIGNATURE-----\n\niHUEAREIAB0WIQRI9smM6nkaYkWBL24eEbWQiaBcawUCZAMpMAAKCRAeEbWQiaBc\na4RcAP0c2zfzNbBjfK5u28LPGwUAuuJ9U2mTWsFpvI2sH1PMNgEArgg0m340TVrS\nQuNTTKu/YOM52oBqw88JTss48+IAjnM=\n=UbrK\n-----END PGP SIGNATURE-----"}'
```
The data is irrelevant here, `/api/user/dry-run` should be replaced with `/api/user`  
Same API idea is for report creating: instead of pure validation `/api/report/validate`
`/api/report` should be used.

## proxy
I2P router has defaults as I2Pd but [listed here](http://127.0.0.1:7657/help#reachabilityhelp)
I2Pd is highly configurable and you can have SOCKS and HTTP proxy. Usually both enabled.
Default HTTP proxy is : port 4444 and host 127.0.0.1.

```shell
# http proxy (i2p & i2pd)
curl -x http://127.0.0.1:4444 \
 'http://ero-like.i2p/api/user/dry-run' \
  -X 'PATCH' \
  -H 'content-type: application/json' \
  --data-raw '{"..data.."}'
# socks for i2pd
curl -x socks5h://127.0.0.1:4447 \
 'http://ero-like.i2p/api/user/dry-run' \
  -X 'PATCH' \
  -H 'content-type: application/json' \
  --data-raw '{"..data.."}'
# you can use explicit b32 address
curl -v -x http://127.0.0.1:4444  \
  'http://ncfq745sechcx2frri56mmds74psse6porzbpb4d7agnbqs5hapq.b32.i2p/api/user/dry-run' \
  -X 'PATCH'   -H 'content-type: application/json'   --data-raw '{"..data.."}'
```
Also useful for testing: `curl -x http://127.0.0.1:4444 'http://proxy.i2p/'`

### Https

ignoring self signed CA with `-k`
```shell
curl -k -x http://127.0.0.1:4444 \
 'https://ero-like.i2p/api/user/dry-run' \
  -X 'PATCH' \
  -H 'content-type: application/json' \
  --data-raw '{"..data.."}'

curl -k -x socks5h://127.0.0.1:4447 \
 'https://ero-like.i2p/'
```

#### CA

You can save self signed CA to file if you want to verify HTTPS connection 
```
-----BEGIN CERTIFICATE-----
MIIDRTCCAi2gAwIBAgIUYpjncDttaolEirnI35/nT0uE4O4wDQYJKoZIhvcNAQEL
BQAwFDESMBAGA1UEAwwJdG9tZnVuLmNvMB4XDTIxMDEwNTEzMjM0N1oXDTMxMDEw
MzEzMjM0N1owFDESMBAGA1UEAwwJdG9tZnVuLmNvMIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEAvSz6ee67Vc7xi8XNgpTd40ePtpQBOIFfBn77R5nKKOui
FGJlC/joMDQlu6j5FYWh9Ie42Ms+olaYdE64XEHpb6tMIhgK2JwuyK2ibiCGJX26
ffxotVHSqm08Vs4del1BHZ9MFApbgYhxeFUsFaKCzPR5c/K4eNHzJhCE2/zf4SFO
4omi/rUAzQWksxX/p7tMoymvylQ2p6XXCNCaZl3a+M96+xJ24WqWHadvc/2k7tX3
y9Q+SD1kUR6S8AG5pUBqx2JVswy2PP49ulRinrfJhrmbvABQmkKYOspSeIyK53yG
kMvggxVwpiUdkuHkmlwXhd/OxeHvsBcJoNVmVeY8aQIDAQABo4GOMIGLMB0GA1Ud
DgQWBBQdQ1B8y85f2NXn9lqT/EyDcfX1XDBPBgNVHSMESDBGgBQdQ1B8y85f2NXn
9lqT/EyDcfX1XKEYpBYwFDESMBAGA1UEAwwJdG9tZnVuLmNvghRimOdwO21qiUSK
ucjfn+dPS4Tg7jAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIBBjANBgkqhkiG9w0B
AQsFAAOCAQEARlSg4v2u3D3LJEgOKaP5Tg5oaU5mbJrdlAk6CdWmKr40SzVEwa0o
cRNjJ0C3e34iW5TRG6NjXY85V3Yo22Yu9V1vHKnlxXm96Ihp4kfh4LnpicTO01jm
Anhr0fcj7OHeA4CX0nU6C+9iypGj9FALncezxAa8WbYIiPeDgM56t2YLeQAU8Khk
Pc6+jAivHTHEWQ5wawsS0JSV+T9G9+heDXBpHQWw6r8sWRVx/pDPoFDQpRmZmsp3
sX0nczqs+Dh6w4stnum5E1ogXeveI/qd+R6lHnIvkY4MMKdUW6870FnHh2zuYI5I
Tgd/BZSNbUzplYcOYa2rQ1ubprhMUzAgZw==
-----END CERTIFICATE-----
```

put it to `ca.crt`

```shell
curl -v --cacert ca.crt \
  -x http://127.0.0.1:4444 \
  'https://ero-like.i2p/api/user/dry-run' \
  -X 'PATCH' \
  -H 'content-type: application/json' \
  --data-raw '{"..data.."}'
```

# Host own ero-like under i2p
## i2pd - lightweight i2p router
### Initial setup

create `tunnels.conf` with something like:
```ini
[http-ero-like]
type = http
host = 172.18.0.3
hostoverride = ero-like.i2p
port = 80
inport = 80
keys = ero-like.online.dat
gzip = false
```

Restart i2pd

```txt
i2p-i2pd-1  | 12:29:56@547/none - i2pd v2.47.0 (0.9.58) starting...
i2p-i2pd-1  | 12:29:59@832/warn - Transports: 15 ephemeral keys generated at the time
i2p-i2pd-1  | 12:29:59@801/warn - SSU2: Unexpected message type 240 from 116.203.124.74:4567 of 125 bytes
i2p-i2pd-1  | 12:29:59@547/critical - Clients: Can't open file /home/i2pd/data/ero-like.online.dat Creating new one with signature type 7 crypto type 0

```

Go to **router** [console on tab "I2P tunnels"](`http://localhost:7070/?page=i2p_tunnels`)

```txt
Server Tunnels:
http-ero-like.online ⇒ ncfq745sechcx2frri56mmds74psse6porzbpb4d7agnbqs5hapq.b32.i2p:80
```
Here we can find i2p base32 address and test if we could connect to it (if we already
configured web server) [ncfq745sechcx2frri56mmds74psse6porzbpb4d7agnbqs5hapq.b32]
Also here we could [click on it](http://localhost:7070/?page=local_destination&b32=ncfq745sechcx2frri56mmds74psse6porzbpb4d7agnbqs5hapq)
and get "Address registration line" 
- enter domain "my-ero-like.i2p" for example
- press "Generate"
- [optional] enter description and register on popular [reg.i2p]
- [optional] get address helper link

Address helper link consist from [domain]/?i2paddresshelper=[Base64]  
http://ero-like.i2p/?i2paddresshelper=KacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKSmnDHUDkRKeWmmK-g5lOiQreBfQ294Hz2iL68GGD5cpKacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKSmnDHUDkRKeWmmK-g5lOiQreBfQ294Hz2iL68GGD5cpKacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKSmnDHUDkRKeWmmK-g5lOiQreBfQ294Hz2iL68GGD5cpKacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKaOfiDskfhZWWQzo82rc~cjnIqTN13o64vJsXdWdXpYkBQAEAAcAAA==

You can use this link on clear web or share with friends

### Https

After creating http we may copy paste it for httpS `tunnels.conf`:
```ini
[https-ero-like]
type = server
host = 172.18.0.3
port = 443
inport = 443
keys = ero-like.online.dat
gzip = false
```

Install openssl and easyrsa, make init-pki, create CA, after that you are able to create
self signed certificate. Honestly there is not need to add names except:
- b32 address
- [domain].i2p

Remove extra lines and replace `ero-like.i2p` with your domain:

```shell
~/bin/EasyRSA-3.1.2/easyrsa \
  --subject-alt-name=DNS:*.ero-like.online \
  --subject-alt-name=DNS:*.ero-like.i2p \
  --subject-alt-name=DNS:ero-like.online \
  --subject-alt-name=DNS:ncfq745sechcx2frri56mmds74psse6porzbpb4d7agnbqs5hapq.b32.i2p \
  build-server-full \
  ero-like.i2p
```

you may test it before using:
```shell
# run server
sudo openssl s_server -accept 0.0.0.0:443 -cert  pki/issued/ero-like.i2p.crt -key pki/private/ero-like.i2p.key -www
# do http call
curl -v --resolve "ero-like.i2p:443:127.0.0.1" https://ero-like.i2p/
```
error like this is ok!
```txt
* TLSv1.3 (OUT), TLS alert, unknown CA (560):
* SSL certificate problem: unable to get local issuer certificate
...
curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it.
```

Alternative test:
`curl -k --resolve "ero-like.i2p:443:127.0.0.1" https://ero-like.i2p/ | grep 'Secure'`

After that copy files on server

Create private key without password
```shell
openssl rsa -in ero-like.i2p.key -out privkey.pem
```

Nginx config may look like:
```conf
server {
    listen 172.18.0.3:80;
    server_name ero-like.i2p ncfq745sechcx2frri56mmds74psse6porzbpb4d7agnbqs5hapq.b32.i2p;
    
    server_tokens off;

    gzip on;
    gzip_min_length  1000;
    gzip_comp_level 9;
    gzip_vary on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript text/html image/gif image/jpeg;
    gzip_buffers 16 8k;

    error_log  /var/log/nginx/ero-like.i2p-error.log;
    access_log /var/log/nginx/ero-like.i2p-access.log;
    # proxy_buffering off;
    location / {
        include /etc/nginx/snippets/proxy;
        proxy_pass http://ero-like.online;
    }
}

server {
    server_name ero-like.i2p ncfq745sechcx2frri56mmds74psse6porzbpb4d7agnbqs5hapq.b32.i2p;

    ssl_client_certificate /crt-tomfun.co/ca.crt;
#    ssl_verify_client on;

    ssl_certificate      /etc/letsencrypt/live/ero-like.i2p/fullchain.pem;
    ssl_certificate_key  /etc/letsencrypt/live/ero-like.i2p/privkey.pem;
    include /etc/nginx/snippets/ssl_modern;
    
    server_tokens off;

    gzip on;
    gzip_min_length  1000;
    gzip_comp_level 9;
    gzip_vary on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript text/html image/gif image/jpeg;
    gzip_buffers 16 8k;

    error_log  /var/log/nginx/ero-like.i2p-error.log;
    access_log /var/log/nginx/ero-like.i2p-access.log;
    # proxy_buffering off;
    location / {
        include /etc/nginx/snippets/proxy;
        proxy_pass http://ero-like.online;
    }
}
```
