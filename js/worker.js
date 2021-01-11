/*
 * @Description: 
 * @Author: Kotori Y
 * @Date: 2021-01-11 09:42:27
 * @LastEditors: Kotori Y
 * @LastEditTime: 2021-01-11 09:43:12
 * @FilePath: \lib\worker.js
 * @AuthorMail: kotori@cbdd.me
 */

onmessage = (event) => {
    importScripts('/js/highlight.pack.js');
    const result = self.hljs.highlightAuto(event.data);
    console.log(result.value)
    postMessage(result.value);
  };