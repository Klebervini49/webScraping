import { Message, MessageMedia } from 'whatsapp-web.js';
import puppeteer from 'puppeteer';

const site =
  'https://www3.mackenzie.br/processos/geraProcesso.php?p=oSYPgF5==oCLn4LMzjwDNLY0PjUtzeCLsjCUmPYND7LhmeURNgn3njnBzewLPvnCFvUZxCYysBeIntQCPqTCLLekHveBnjYgD7L';
var dataFinal: any;

function execute(message: Message): void {
  async (foto: any) => {
    if (foto.hasMedia) {
      const media = await foto.downloadMedia();
    }
  };
  const results = new Promise((res, rej) => {
    (async () => {
      var screenshot;
      const pathToExtension = require('path').join(__dirname, 'my-extension');

      const browser = await puppeteer.launch({
        headless: 'chrome',
        args: [
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`,
        ],
      });
      const page = await browser.newPage();

      await page.setViewport({ width: 1280, height: 2000 });
      await page.goto(site);
      const att = await page.evaluate(() => {
        const alerta = document.querySelector(
          '.divAvisoRoundBlue.text-center.mt-5 .size40.na'
        );
        const parte: any = document.querySelector(
          '.divAvisoRoundBlue.text-center.mt-5'
        );

        let dadosDiv = alerta?.innerHTML;

        let dados = +parte.getBoundingClientRect().top - 40;
        window.scroll(0, dados);

        let ultimaAtt = `${dadosDiv}`;

        return ultimaAtt;
      });
      await page.screenshot({
        path: 'screenshot.png',
        fullPage: false,
      });
      await browser.close();
      if (att === 'REQUERIMENTO EM ANDAMENTO')
        return (dataFinal = `${att} - AINDA NADA 😡 `);
      else if (att !== 'REQUERIMENTO EM ANDAMENTO')
        return (dataFinal = `${att}\n- Houve  uma mudança 😍\n\nRecomendo entrar no site (https://www3.mackenzie.br/processos/geraProcesso.php?p=oSYPgF5==oCLn4LMzjwDNLY0PjUtzeCLsjCUmPYND7LhmeURNgn3njnBzewLPvnCFvUZxCYysBeIntQCPqTCLLekHveBnjYgD7L) `);
    })().then((r) => {
      console.log(r);
      try {
        if (!dataFinal) {
          console.log('!!error');
        } else {
          message.reply(dataFinal);
          const media = MessageMedia.fromFilePath('./screenshot.png');
          message.reply(media);
        }
      } catch (errro) {
        console.log(errro);
      }

      return r;
    });
  });
}

export default {
  execute,
  name: 'r',
  options: {
    scope: ['private_chat', 'group'],
  },
};
