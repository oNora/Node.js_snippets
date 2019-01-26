
/**
 * test if /lib/data.js is working properly.
 * Before try it create folder testLib in .data dir
 */

const _data = require('./lib/data');

_data.create('testLib', 'newFile', { 'foo': 'bar' }, (err) => {
    console.log('err', err);
});
// _data.read('testLib', 'newFile', (err, data) => {
//     console.log('err', err);
//     console.log('data', data);
// });
// _data.update('testLib', 'newFile', { 'fizz': 'buzz' }, (err) => {
//     console.log('err', err);
// });
// _data.delete('testLib', 'newFile', (err) => {
//     console.log('err', err);
// });