const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');

const _formatUrl = (imgUrl) => {
    return imgUrl.replace('_s', '');
}

const _filterContent = (htmlData) => {
    if (!htmlData) {
        console.log('html获取失败');
    }
    let $ = cheerio.load(htmlData);
    const container = $('#container');
    let contentData = [];
    container.find('.box').each((index, element) => {
        const pic = $(element);
        let src = _formatUrl(pic.find('a').children('img').attr('src2'));
        let name = _formatUrl(pic.find('a').children('img').attr('alt'));
        _download(src, name)
        contentData.push({
            index,
            src,
            name
        })
    });
    console.log(contentData)

}

const _download = (url, name) => {
    http.get(url, (res) => {
        let imgData = '';
        //设置图片编码格式
        res.setEncoding("binary");
        //检测请求的数据
        res.on('data', (chunk) => {
            imgData += chunk;
        })
        res.on('end', () => {
            // 没有文件夹则创建 以防报错
            if (!fs.existsSync('./images')) {
                fs.mkdirSync('./images');
            };
            fs.writeFile(`./images/${name}.jpg`, imgData, 'binary', (error) => {
                error ? console.log(error) : console.log(`${name}----下载成功！`)
            })
        })
    })

}

const Crawler = {
    Run: (URL) => {
        http.get(URL, (res) => {
            let htmlData = '';
            res.on('data', (chunk) => {
                htmlData += chunk;
            });

            res.on('end', () => {
                _filterContent(htmlData);
            });
        }).on('error', () => {
            console.log('获取数据出错！');
        })
        
    }
}

module.exports = Crawler;