import assert from 'assert';
import fetch from 'r2';
import pdf from '@cyber2024/pdf-parse-fixed';
import {parse} from 'csv-parse';
const parsePDF = data => pdf(Buffer.from(data, 'binary'));
const mimeTypes = {
  pdf: 'application/pdf',
  word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'text/csv; charset=utf-8'
};

const getType = header => {
  return Object.keys(mimeTypes).find(key => mimeTypes[key] === header);
};

const downloadWithRetries = async (url, headers, attempt = 0) => {
  return fetch(url, { headers }).response
    .then(res => {
      if (res.status !== 200 && attempt < 3) {
        return downloadWithRetries(url, headers, attempt + 1);
      }
      return res;
    })
    .catch(e => {
      // running tests in a docker container will not be able to access `localhost`
      // if accessing `localhost` throws ECONNREFUSED then map to docker host
      if (e.code === 'ECONNREFUSED' && url.includes('localhost')) {
        return downloadWithRetries(url.replace('localhost', 'host.docker.internal'), headers, attempt);
      }
      throw e;
    });
};

const getFile = async function (url, type) {
  const allCookies = await browser.getCookies();
  const sid = allCookies.find(c => c.name === 'sid').value;
  const headers = { cookie: `sid=${sid}` };
  return browser.call(() => {
    return downloadWithRetries(url, headers)
      .then(async res => {
        assert.equal(res.status, 200);
        if (type && type !== 'raw') {
          assert.equal(res.headers.get('content-type'), mimeTypes[type]);
        } else if (type !== 'raw') {
          // if type is not defined then infer it from the response type
          // eslint-disable-next-line no-param-reassign
          type = getType(res.headers.get('content-type'));
        }
        return res.buffer();
      })
      .then((data) => {
        switch (type) {
          case 'pdf':
            return parsePDF(data).then(pdf => pdf.text.replace(/\s/g, ' '));
          case 'csv':
            return parse(data, { bom: true, columns: true, relax_column_count: true });
          case 'raw':
            return data;
          default:
            return data.toString('utf8');
        }
      });
  });
};

const download = async function(type) {
  return getFile(await this.getProperty('href'), type);
};

const downloadFile = async function(fileType) {
  let expanded = false;

  // scroll window to top before trying to interact with download header
  await this.$('header[role="banner"]').scrollIntoView();

  let toggleLink = await this.$('.document-header a.toggle-details');

  if (await toggleLink.isDisplayed() && (await toggleLink.getText()).includes('View')) {
    await toggleLink.click();
    expanded = true;
  }

  const fileTypeMapping = {
    pdf: {
      selector: 'a*=PDF',
      type: 'pdf'
    },
    nts: {
      selector: 'a=Download non-technical summary as a PDF',
      type: 'pdf'
    },
    word: {
      selector: 'a*=DOCX',
      type: 'word'
    },
    csv: {
      selector: 'a*=CSV',
      type: 'csv'
    }
  };

  const typeSpec = typeof fileType === 'string' ? fileTypeMapping[fileType] : fileType;

  if (!typeSpec?.selector) {
    throw new Error('selector must be defined');
  }

  // default type to 'pdf'
  typeSpec.type = typeSpec.type || 'pdf';

  // must get href before closing the toggle
  const url = await this.$(typeSpec.selector).getProperty('href');

  if (await toggleLink.isDisplayed() || expanded) {

    if (expanded) {
      toggleLink = await this.$('.document-header a.toggle-details');
      await browser.waitUntil(async () => {
        const text = await toggleLink.getText();
        return typeof text?.includes === 'function' && text.includes('Hide');
      });
    }

    const text = await toggleLink.getText();

    if (typeof text?.includes === 'function' && text.includes('Hide')) {
      await toggleLink.scrollIntoView({block: 'center'});
      await toggleLink.click();
    } else {
      console.log({text});
    }
  }

  return getFile(url, typeSpec.type);

};

export {
  download,
  downloadFile
};
