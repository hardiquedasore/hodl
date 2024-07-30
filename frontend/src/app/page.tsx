'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from '@/app/firebase';
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import { table } from "console";

type ReportData = {
  transactionHash: string;
  transactionIndex: string;
  blockHash: string;
  blockNumber: string;
  from: string;
  to: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  logs: any[];
  status: string;
  logsBloom: string;
};

export default function Home() {
  const token = sessionStorage.getItem('token');
  const router = useRouter();
  const [vendorName, setVendorName] = useState('');
  const [distance, setDistance] = useState('');
  const [diesel, setDiesel] = useState('');
  const [electricity, setElectricity] = useState('');
  const [transport, setTransport] = useState('');
  const [dataTable, setDataTable] = useState<any[]>([]);
  useEffect(() => {
    if (!token) {
      router.push('/sign-in');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/report/all', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);
        // if (data.countData) {
        //   for (let i = 0; i < data.countData; i++) {
        //     try {
        //       const reportResponse = await fetch(`http://localhost:8080/report/${i}`, {
        //         method: 'GET',
        //         headers: {
        //           'Authorization': 'Bearer ' + token,
        //           'Content-Type': 'application/json'
        //         }
        //       });
        //       const reportData = await reportResponse.json();
        //       setDataTable(prevDataTable => [...prevDataTable, reportData.reportJsonData]);
        //       console.log(reportData)

        //     } catch (e) {
        //       console.error(e);
        //     }
        //   }
        // }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [token, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if(token){
      const response = await fetch('http://localhost:8080/report/add', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer '+ token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vendorName: vendorName,
          distance: distance,
          diesel: diesel,
          transport: transport,
          electricity: electricity        })
      });
      const data = await response.json();
      setVendorName('');
      setDiesel('');
      setDistance('');
      setElectricity('');
      setTransport('');
      router.push('/');
    }
    } catch(e){
      console.error(e)
    }
    };

  return (
    <main className="p-8">
      
      <a
  className="rounded float-end cursor-pointer border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none "
  onClick={()=> {sessionStorage.removeItem('token')
    router.push('/sign-in')
  }}
>
  Sign out
</a>
      <div className="flex flex-col p-8 z-10 w-full max-full font-mono text-sm lg:flex">
        <h1 className="text-4xl p-4 text-center">Reports</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-8">
  <div className="w-1/2">
  <h1 className="text-2xl p-4 text-center">Add Report</h1>
  <form onSubmit={handleSubmit} className="space-y-6">

  <div>
            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">Vendor Name</label>
            <input
              id="vendorName"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distance</label>
            <input
              id="distance"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="diesel" className="block text-sm font-medium text-gray-700">Diesel</label>
            <input
              id="diesel"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={diesel}
              onChange={(e) => setDiesel(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="electricity" className="block text-sm font-medium text-gray-700">Electricity</label>
            <input
              id="electricity"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="transport" className="block text-sm font-medium text-gray-700">Transport</label>
            <input
              id="transport"
              type="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
  
  </form></div>
  <div>
<div className="overflow-x-auto">
  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
    <thead className="text-left">
      <tr>
        <th className="p-2 font-medium text-gray-900">Transaction Index</th>
        <th className="p-2 font-medium text-gray-900">Transaction  Hash</th>
        <th className="p-2 font-medium text-gray-900">Block</th>
        <th className="p-2 font-medium text-gray-900">Gas Used</th>
        <th className="p-2 font-medium text-gray-900">From</th>
        <th className="p-2">To</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
        {
          dataTable.map((el, index)=> (
            <tr key={index}>
                      <td className="p-2 font-medium text-gray-900">{el.transactionIndex}</td>
                      <td className="p-2 text-gray-700">{el.transactionHash}</td>
                      <td className="p-2 text-gray-700">Block No.: {el.blockNumber}<br/> Block Hash: {el.blockHash}</td>
                      <td className="p-2 text-gray-700">{el.gasUsed}</td>
                      <td className="p-2 text-gray-700">{el.from}</td>
                      <td className="p-2 text-gray-700">{el.to}</td>

                    
</tr>
           )
          )
        }

    </tbody>
  </table>
</div>
  </div>
</div>
    </main>
  );
}
