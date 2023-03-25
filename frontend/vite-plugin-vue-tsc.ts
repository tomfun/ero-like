import { exec } from 'child_process';
import { join } from 'path';
import * as _ from 'lodash';

const binDirVueTsc = join('node_modules', process.platform === 'win32' ? 'bin' : '.bin', 'vue-tsc');

function runVueTSC(tsconfigPath: string) {
  exec(`node ${binDirVueTsc} --noEmit -p ${tsconfigPath} --pretty`, (error, stdout, stderr) => {
    console.log('\x1b[32m%s\x1b[0m', 'vue-tsc');
    console.log(stdout);
    if (stderr) {
      console.error('\x1b[31m%s\x1b[0m', 'vue-tsc');
      console.error(stderr);
    }
  });
}

export function vitePluginVueTSC({ tsconfigPath }: { tsconfigPath: string }) {
  return {
    name: 'vite-plugin-vue-tsc',
    // (ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>
    handleHotUpdate: _.debounce(_.partial(runVueTSC, tsconfigPath), 300),
  };
}
