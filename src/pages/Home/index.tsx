import CoupleSeat from '@/components/CoupleSeat';
import SingleSeat from '@/components/SingleSeat';
import { storage } from '@/utils/storage';
import { Button, Col, Modal, Row, Select, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import AddMove from './addMove';
import EasyPrint from './print';

import {
  hallSeat1,
  hallSeat2,
  hallSeat3,
  hallSeat4,
  hallSeat5,
  hallSeat6,
  hallSeat7,
} from './contant';
import './index.less';

const { confirm } = Modal;

const hallOptions = [
  { label: '1号厅', value: '1' },
  { label: '2号厅', value: '2' },
  { label: '3号厅', value: '3' },
  { label: '4号厅', value: '4' },
  { label: '5号厅', value: '5' },
  { label: '6号厅', value: '6' },
  { label: '7号厅', value: '7' },
];

const HomePage: React.FC = () => {
  const [c, setC] = useState<number>(1);
  const [info, setInfo] = useState<any>({});
  const seat: Record<string, any[][]> = {
    1: hallSeat1,
    2: hallSeat2,
    3: hallSeat3,
    4: hallSeat4,
    5: hallSeat5,
    6: hallSeat6,
    7: hallSeat7,
  };

  const [seatMap, setSeatMap] = useState<any[][]>(seat['1']);
  const [selectedSeat, setSelectedSeats] = useState<any[][]>([]);
  const [hall, setHall] = useState<string>('1');
  const [film, setFilm] = useState<string>('');

  const [filmOptions, setFilmOptions] = useState<Record<string, any[]>>({});
  const [totalNum, setTotalNum] = useState<number>(0);

  const handleClickSingle = (indexRow: number, indexCol: number) => {
    if (!hall || !film) {
      message.info('请先选择电影场次！');
      return;
    }
    const tempMap = JSON.parse(JSON.stringify(seatMap));
    if (tempMap[indexRow][indexCol].status === 1) {
      tempMap[indexRow][indexCol].status = 2;
      setSeatMap(tempMap);
      storage.set(film, JSON.stringify(tempMap));
      return;
    }
    if (tempMap[indexRow][indexCol].status === 2) {
      tempMap[indexRow][indexCol].status = 1;
      setSeatMap(tempMap);
      storage.set(film, JSON.stringify(tempMap));
      return;
    }
    if (tempMap[indexRow][indexCol].status === 3) {
      confirm({
        title: '提示',
        content: '该座位已出票，确认取消锁定该座位吗？',
        onOk() {
          tempMap[indexRow][indexCol].status = 1;
          setSeatMap(tempMap);
          storage.set(film, JSON.stringify(tempMap));
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  const beforehandlePrint = () => {
    if (!hall || !film || !selectedSeat.length) {
      message.info('请检查需要打印的信息');
      return;
    }
  };

  const handleAfterPrint = (seats: any[]) => {
    let tempMap = JSON.parse(JSON.stringify(seatMap));
    // 将 storage 中的数据 转成 number 类型
    let tempTotalNum = parseInt(storage.get("totalPriceNum")) || 0;
    console.log(seats)
    seats.forEach((seat) => {
      tempMap = tempMap.map((row, rowIndex) =>
        row.map((col, colIndex) => {
          const isCoupleSeat = col.status === 2 && col.type === 'couple';
          const isSingleSeat = col.status === 2 && col.type === 'single';
          const isMatchingCoupleSeat = isCoupleSeat && rowIndex === seat[0] - 1 && col.number.includes(seat[1]);
          const isMatchingSingleSeat = isSingleSeat && rowIndex === seat[0] - 1 && col.number === seat[1];
          if (isMatchingCoupleSeat || isMatchingSingleSeat) {
            return { ...col, status: 3 };
          } else {
            return col;
          }
        })
      );
    });
    setSeatMap(tempMap);
    tempTotalNum = tempTotalNum + seats.length;
    setTotalNum(tempTotalNum);
    storage.set("totalPriceNum", tempTotalNum);
    storage.set(film, JSON.stringify(tempMap));
  }

  const handleResetSeat = () => {
    confirm({
      title: '提示',
      content: '确认清除所有场次的已选座位吗？',
      onOk() {
        const storageList = storage.get('movieList');
        if (!storageList) return;
        const movieList = JSON.parse(storageList);
        movieList.forEach((item: any) => {
          const emptySeat = seat[item.hall];
          storage.set(item.key, JSON.stringify(emptySeat));
        });
        setC((v) => v + 1);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    const storageList = storage.get('movieList');
    if (!storageList) return;
    const movieList = JSON.parse(storageList);
    const fOptions: Record<string, any[]> = {};
    movieList.forEach((item: any) => {
      if (fOptions[item.hall]) {
        fOptions[item.hall].push({
          value: item.key,
          label: `${item.name}  (${item.time})`,
          info: item,
        });
      } else {
        fOptions[item.hall] = [
          {
            value: item.key,
            label: `${item.name}  (${item.time})`,
            info: item,
          },
        ];
      }
    });
    setFilmOptions(fOptions);
  }, [c]);
  useEffect(() => {
    const tempSelected: any[] = [];
    seatMap.forEach((row, rowIndex) => {
      row.forEach((col) => {
        if (col.status === 2 && col.type === 'single') {
          tempSelected.push([rowIndex + 1, col.number]);
        }
        if (col.status === 2 && col.type === 'couple') {
          const [s1, s2] = col.number;
          tempSelected.push([rowIndex + 1, s1], [rowIndex + 1, s2]);
        }
      });
    });
    setSelectedSeats(tempSelected);
  }, [seatMap]);

  useEffect(() => {
    if (!hall) return;
    if (film === '') {
      setSeatMap(seat[hall]);
    } else {
      setInfo(
        filmOptions[hall].filter((item) => item.value === film)?.[0].info,
      );
      const hallSeat = JSON.parse(storage.get(film));
      setSeatMap(hallSeat);
    }
  }, [film, c]);

  return (
    <div className="container">
      <div className="select-div">
        <div>
          <span>总票数：</span>
          <span>{totalNum}</span>
        </div>
      </div>
      <div className="select-div">
        <div>
          <span>影厅：</span>
          <Select
            style={{ width: '200px' }}
            value={hall}
            onChange={(e: string) => {
              setHall(e);
              setFilm('');
            }}
            options={hallOptions}
          ></Select>
          <span style={{ marginLeft: '12px' }}>电影场次：</span>
          <Select
            style={{ width: '300px' }}
            value={film}
            onChange={(e: string) => {
              setFilm(e);
            }}
            options={filmOptions[hall]}
          ></Select>
          <span style={{ marginLeft: '12px' }}> </span>
        </div>
        <div className="top-bar">
          <Button
            type="default"
            onClick={handleResetSeat}
            style={{ marginRight: '8px' }}
          >
            重置场次
          </Button>
          <AddMove setC={setC}></AddMove>
        </div>
      </div>
      <div className="choose-seat-div">
        <div className="screen">银幕(Screen)</div>
        {seatMap?.map((row: any[], indexRow: number) => {
          return (
            <div key={`${indexRow}`} className="row-div">
              <div className="row-number">{indexRow + 1}排</div>
              <Row>
                {row.map((col: any, indexCol: number) => {
                  if (col.type !== 'couple') {
                    return (
                      <div
                        onClick={() => handleClickSingle(indexRow, indexCol)}
                        key={`${indexRow}${indexCol}`}
                      >
                        <Col>
                          <SingleSeat
                            name={String(col.number)}
                            status={String(col.status)}
                          ></SingleSeat>
                        </Col>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        onClick={() => handleClickSingle(indexRow, indexCol)}
                        key={`${indexRow}${indexCol}`}
                      >
                        <Col>
                          <CoupleSeat
                            name={col.number}
                            status={col.status}
                          ></CoupleSeat>
                        </Col>
                      </div>
                    );
                  }
                })}
              </Row>
            </div>
          );
        })}
      </div>
      <div className="validate-info">
        <div style={{ marginBottom: '10px' }}>您已选择了:</div>
        <div style={{ display: 'flex' }}>
          {selectedSeat.map((item) => {

            item
            return (
              <div className='print-box'>
                <Tag color="volcano">
                  <span className="seat-info">
                    {item[0]} 排 {item[1]} 座
                  </span>
                </Tag>
              </div>
            );
          })}

        </div>
      </div>
      <EasyPrint printList={selectedSeat} hall={hall} info={info} handleAfterPrint={handleAfterPrint} />
    </div>
  );
};

export default HomePage;
