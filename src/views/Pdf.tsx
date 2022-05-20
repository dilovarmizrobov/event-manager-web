import React, {useCallback, useRef} from 'react';
import jsPDF from "jspdf";
import {Button} from "@mui/material";
import { toPng } from 'html-to-image';
import puppeteer from "puppeteer/lib/esm/puppeteer/node-puppeteer-core";

let html = `<!DOCTYPE html>
             <html dir="ltr">
                <head>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
                    <style>
                        * {
                            box-sizing: border-box;
                            font-family: Palatino Linotype;
                        }
                        .app {
                            text-align: center;
                            max-width: 501px;
                            max-height: 836px;
                            background-image: url("/badge/background-water.png");
                        }
                        .header {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        p {
                            font-size: 14px;
                            color: #00a0e3;
                            line-height: 17px;
                            font-weight: 700;
                            margin: 14px 0;
                        }
                        .logo {
                          width: 96px;
                          height: 97px;
                          border-radius: 50%;
                        }
                        .text {
                          display: flex;
                          flex-direction: column;
                          margin-top: 35px;
                        }
                        .card {
                          display: flex;
                          justify-content: center;
                          margin-top: 25px;
                          margin-bottom: 20px;
                        }
                        .card-rectangle {
                          max-width: 100%;
                          max-height: 100%;
                        }
                        .image-rectangle {
                          width: 188px;
                          height: 246px;
                          object-fit: contain;
                          border-radius: 10px;
                        }
                        
                        .card-text {
                          margin-left: 30px;
                        }
                        
                        .card-text-img {
                          width: 88px;
                          height: 60px;
                        
                          border-radius: 10px;
                          margin-top: -7px;
                        }
                        
                        .card-text-tajikistan {
                          color: red;
                        }
                        
                        .water-image{
                          width: 100%;
                          height: 100px;
                          object-fit: cover;
                        }
                        
                        .footer {
                          background-color: mediumseagreen;
                          height: 50px;
                          width: 100%;
                          text-align: center;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          color: #ffffff;
                          font-size: 41px;
                          font-weight: 700;
                        }
                    </style>
                </head>
                <body>
                    <div class="app">
                        <div class="header">
                            <img src="/badge/logo.png" alt="" class="logo">
                            <div class="text">
                                <p>
                                   ДУШАНБИНСКИЙ ВОДНЫЙ ПРОЦЕСС <br />
                                   2-ая Международная конференция высокого уровня
                                   <br /> по Международному десятилетию действий
                                   <br /> «Вода для устойчивого развития», 2018-2028 <br /> 6-9 июня
                                   2022 года
                                </p>
                                <p>
                                    DUSHANBE WATER PROCESS <br/> 2nd High-Level International
                                    Conference on International <br/> Decade for Action “Water for
                                    Sustainable <br/>
                                    Development”, 2018-2028 <br/>
                                    6-9 June 2022
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>`

const Pdf = () => {
    const ref = useRef<HTMLDivElement>(null)

    let doc = new jsPDF('p', 'px', 'a4', false);


    // const handleClick = () => {
        // doc.html('<body><style>h1{color:red}</style><h1>Hello World</h1><img src="/event-manager/guests/load-image/S7338WUNsr.png" alt="..."/></body>', {
    //     doc.html(html, {
    //         callback: function (doc) {
    //             doc.save();
    //         },
    //         x: 10,
    //         y: 10,
    //
    //     });
    // }

    const onButtonClick = useCallback(() => {
        if (ref.current === null) {
            return
        }

        ref.current.innerHTML = html;

        toPng(ref.current, {width: 501, pixelRatio: 1})
            .then((dataUrl) => {
                let img = new Image();
                img.src = dataUrl;

                doc.addImage(dataUrl, 'PNG', 10, 10, img.width, img.height)
                doc.save("test.pdf");

                // const link = document.createElement('a')
                // link.download = 'my-image-name.png'
                // link.href = dataUrl
                // link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref])

    return (
        <>
            {/*<Button onClick={handleClick}>*/}
            {/*    <img src="https://tinypng.com/images/example-shrunk.png" alt="..."/>*/}
            {/*</Button>*/}
            <div ref={ref}></div>
            {/*Test*/}
            {/*<img src="/event-manager/guests/load-image/S7338WUNsr.png" alt="..."/>*/}
            <Button onClick={onButtonClick}>click</Button>
        </>
    );
};

export default Pdf;