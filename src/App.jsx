import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import Picker from 'react-month-picker';
import MonthPicker from "simple-react-month-picker";
import {Chart, registerables} from 'chart.js';
import 'react-month-picker/css/month-picker.css'
import moment from 'moment';
Chart.register(...registerables);
let chart = null;
function App() {
const[sshow,ssetShow]=useState(false);
  return (
    <main>
      <header>
        <p>Water storage in California reservoirs</p>
      </header>
      <div className={'content col-10'}>
        <div className={'row introduction'}>
          <div className={'col-12 intro-image'}>
            <img className={'photo'} src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg"/>
            Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of
            California's Historic Drought.
          </div>
          <div className={'col-12 intro-text'}>
            <p className={'left'}>
              California's reservoirs are part of a <a
              href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water
              storage system</a>. The State has very variable weather, both seasonally and from year-to-year, so storage and
              water management is essential. Natural features - the Sierra snowpack and vast underground aquifers - provide
              more storage capacity, but reservoirs are the part of the system that people control on a day-to-day basis.
              Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding
              and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.
              Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage. Finally,
              hydro-power from the many dams provides carbon-free electricity.
            </p>
            <p className={'left'}>
              California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
            </p>
            <button className={'button'} onClick={() => ssetShow(!sshow)}>{sshow ? 'show less' : 'show more'}</button>
          </div>
        </div>
      <Showmore more={sshow} />

      </div>

    </main>
  );
}

function Showmore(props) {
  const [show, setShow] = useState(false);
  
  const ref = useRef();
  const [m, setM] = useState({year: 2022, month: 5})

  useEffect(() => {
    let start, end;
    start = moment(`${m.year}-${m.month}-01`).startOf('month').toDate().getTime();
    end = moment(`${m.year}-${m.month}-01`).endOf('month').toDate().getTime();
    const fetchData = async () => {
      const res = await fetch(`/api/waters/${start}/${end}`);
      const data = await res.json();
      var ctx = document.getElementById('myChart').getContext('2d');
      var capacity=[4552000,3537577,2447650,2400000,1062000,2030000,1602000]
      console.log("capacity:",capacity);
      var values=data.map(item => item.value);
      console.log("values:",values);
      var backbar=capacity.map(function(item,index){
        return item-values[index];
      })
      console.log("minus:",backbar)
      if (chart) {
        chart.destroy();
      }
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels:['Shasta', 'Oroville', 'Trinity Lake', 'New Melones', 'San Luis', 'Don Pedro', 'Berryessa'],
          //labels: data.map(item => item.stationId),
          datasets: [{
            label: 'water',
            data: data.map(item => item.value),
            backgroundColor: 'rgb(66, 145, 152)',
            barThickness:25
          },{
            label: 'capacity',
            data: backbar,
            backgroundColor: 'rgb(120, 199, 227)',
            barThickness:25
          }]
        },
        options: {
          maintainAspectRatio:false,
          plugins:{
            legend:false
          },
          scales: {
            x:{
              stacked:true,
              grid:{
                display:false
              }
            },
            y: {
              grid:{
                display:false
              },
              beginAtZero: true,
              stacked:true,
              max:6000000,
              ticks:{
                stepSize:1000000
              }
            }
          }
        }
      });
    }
    fetchData();

  }, [m]);
  
  if (!props.more) {
    return null;
  }
  return (
      <div className={'chart row'}>
          <div className={'chart-search col-12'}>
            <p className={'left'}>
              Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California
              Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government
              agencies, and electric utilities. Select a month and year to see storage levels in the eleven largest in-state
              reservoirs.
            </p>
            <div className={'changeM'}>
              <h3 className={'search-title'}>Change month:</h3>
              <Picker
                years={{min: {year:2020, month: 1}, max: {year:2022, month: 5}}}
                lang={[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
              ]} value={m} ref={ref} show={show} onChange={(year, month) => {
                setM({year, month})
                setShow(false);
              }}>
                <div onClick={() => setShow(!show)} style={{padding: '10px', border: '1px solid gray', width: '150px'}}>{moment(`${m.year}-${m.month}`).format("MMM YYYY")}</div>
              </Picker>
            </div>
          </div>
          <div className={'bar-chart col-12'}>
            <canvas id={"myChart"}></canvas>
          </div>
        </div>
  );
}
export default App;