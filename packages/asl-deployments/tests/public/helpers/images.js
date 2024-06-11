import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import compareImages from 'resemblejs/compareImages.js';
import pdf from 'pdfjs-dist';
import Canvas from 'canvas';
import jimp from 'jimp';
import QR from 'qrcode-reader';
import mammoth from 'mammoth';

class NodeCanvas {
  create (w, h) {
    const canvas = Canvas.createCanvas(w, h);
    const context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context
    };
  }

  reset (scope, w, h) {
    scope.canvas.width = w;
    scope.canvas.height = h;
  }

  destroy (scope) {
    scope.canvas.width = 0;
    scope.canvas.height = 0;
    scope.canvas = null;
    scope.context = null;
  }
}

const isSameImage = async (imgPath1, imgPath2) => {
  return compareImages(await readFile(imgPath1), await readFile(imgPath2));
};

const captureAndCompareImage = async (browser, selector, originalImagePath, key = 'image-compare') => {
  // If browser isn't scrolled to origin, screenshot is offset
  // https://github.com/webdriverio/visual-testing/issues/83#issuecomment-1280861910
  await browser.waitForSync();
  await browser.scroll();

  const domImage = await browser.$(selector);

  const capturedImage = await browser.saveElement(domImage, key, { screenshotPath: './' });
  const capturedImagePath = path.resolve(capturedImage.path, capturedImage.fileName);

  const data = await isSameImage(originalImagePath, capturedImagePath);
  if (data.rawMisMatchPercentage !== 0) {
    await writeFile(path.resolve(capturedImage.path, `diff-${capturedImage.fileName}`), data.getBuffer());
    return false;
  }
  return true;
};

const findQRCodesInPDF = async data => {
  let qrCodes = [];
  let pageNum = 1;
  const uint8Array = new Uint8Array(data);
  const doc = await pdf.getDocument({ data: uint8Array }).promise;

  while (pageNum < doc.numPages) {
    const page = await doc.getPage(pageNum);
    // Render the page on a Node canvas with 100% scale.
    const viewport = page.getViewport({ scale: 1 });
    const canvasFactory = new NodeCanvas();
    const canvasAndContext = canvasFactory.create(
      viewport.width,
      viewport.height
    );

    await page.render({
      canvasContext: canvasAndContext.context,
      viewport,
      canvasFactory
    }).promise;

    const imgData = canvasAndContext.canvas.toBuffer();

    const code = await new Promise((resolve, reject) => {
      jimp.read(imgData, function(err, image) {
        if (err) {
          reject(err);
        }
        const qr = new QR();
        qr.callback = (err, value) => {
          return err ? resolve(null) : resolve(value.result);
        };
        qr.decode(image.bitmap);
      });
    });

    if (code) {
      qrCodes.push(code);
    }

    pageNum++;
  }

  return qrCodes;
};

const findQRCodesInDocx = async docx => {
  let qrCodes = [];

  await mammoth.convertToHtml({ buffer: docx }, {
    convertImage: mammoth.images.imgElement(async image => {
      const imageBuffer = await image.read();

      const code = await new Promise((resolve, reject) => {
        jimp.read(imageBuffer, function(err, image) {
          if (err) {
            reject(err);
          }
          const qr = new QR();
          qr.callback = (err, value) => {
            return err ? resolve(null) : resolve(value.result);
          };
          qr.decode(image.bitmap);
        });
      });

      if (code) {
        qrCodes.push(code);
      }
    })
  });

  return qrCodes;
};

export {
  captureAndCompareImage,
  findQRCodesInPDF,
  findQRCodesInDocx
};
