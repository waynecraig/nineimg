const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const data = fs.readdirSync(path.join(__dirname, '../data'))
    .filter(d=>!/^\./.test(d))
    .map(sid=>{
        const bids = fs.readdirSync(path.join(__dirname, '../data', sid))
            .filter(d=>!/^\./.test(d))
            .map(bid=>{
                const pids = fs.readdirSync(path.join(__dirname, '../data', sid, bid))
                    .filter(d=>!/^\./.test(d));
                return {bid, pids};
            });
        return {sid, bids};
    });

data.map(d=>{
    const sid = d.sid;
    fs.mkdirSync(path.join(__dirname, '../thumb', sid));
    d.bids.map(a=>{
        const bid = a.bid;
        fs.mkdirSync(path.join(__dirname, '../thumb', sid, bid));
        a.pids.map(pid=>{
            console.log('start', path.join(__dirname, '../data', sid, bid, pid));
            sharp(path.join(__dirname, '../data', sid, bid, pid))
                .resize(50, 50)
                .toFile(path.join(__dirname, '../thumb', sid, bid, pid))
                .then(d=>{
                    console.log('end', path.join(__dirname, '../thumb', sid, bid, pid));
                    console.log(d);
                });
        });
    });
});
