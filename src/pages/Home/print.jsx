import React from 'react';
import hiprint from "easy-print";
import { Button, message } from 'antd';
import ticketPanel from './panel';
import converResDataToPrintData from './adapter';
 
const { useState, useEffect, useImperativeHandle, ref } = React;

const hiprintTemplate = new hiprint.PrintTemplate({ template: ticketPanel });

const EasyPrint = (props) => {
  // printList 是业务返回回来的需要打印的数据，需要经过一层适配器转换，转换称打印真正接收的数据。
  const { printList, info, hall, handleAfterPrint } = props;
  // printData 打印接受的数据 
  const [printData, setPrintData] = useState([]);
  const [previewDiv, setPreviewDiv] = useState(null);

  useImperativeHandle(ref, () => ({
    handlePrint: () => {
      hiprintTemplate.printByHtml(previewDiv);
    },
  }));

  useEffect(() => {
    setPrintData(converResDataToPrintData(printList,info));
  }, [printList]);

  useEffect(() => {
    const previewDom = hiprintTemplate.getSimpleHtml(printData);
    setPreviewDiv(previewDom);
  }, [printData]);

  return (
    <div>
      <Button onClick={onprint} >打印</Button>
      <div
      //  style={{ display : "none"}}
       dangerouslySetInnerHTML = {{ __html: previewDiv ? previewDiv.html() : '' }} />
    </div>
  )

  function onprint() {

    if (!hall || !info || !printList.length) {
      message.info('好像还没有选择数据');
      return;
    }
    hiprintTemplate.printByHtml(previewDiv);
    handleAfterPrint(printList);
  }



};

export default EasyPrint;