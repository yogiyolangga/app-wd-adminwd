import { useEffect, useState } from "react";
import Axios from "axios";

import { BiLoaderCircle } from "react-icons/bi";

export default function TotalWdAgent({ dataWdFromDb }) {
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const getAgentList = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await Axios.get(`${apiUrl}/adminwd/agent`);
      if (response.data.success) {
        setAgentList(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Error trying get Agent Data");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAgentList();
  }, []);

  const getLengtByAgent = (id) => {
    let agentLength = 0;
    const filterByAgent = dataWdFromDb.filter(
      (item) => item.agent_id === id && item.status === "success"
    );
    agentLength = filterByAgent.length;
    return agentLength;
  };

  const getTotalByAgent = (id) => {
    let agentTotal = 0;
    const filterByAgent = dataWdFromDb.filter(
      (item) => item.agent_id === id && item.status === "success"
    );
    agentTotal = filterByAgent.reduce((total, item) => total + item.nominal, 0);

    return agentTotal;
  };

  const rupiah = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const totalSuccessWd = dataWdFromDb.filter(
    (item) => item.status === "success"
  );

  const grandTotalWd = () => {
    const filterData = dataWdFromDb.filter((item) => item.status === "success");
    const grandTotal = filterData.reduce(
      (total, item) => total + item.nominal,
      0
    );

    return grandTotal;
  };

  return (
    <>
      <div>
        <h2 className="kanit-medium dark:text-zinc-50">Total WD Agent</h2>
        <div className="relative overflow-x-auto rounded-md min-w-[500px]">
          {loading ? (
            <div>
              <BiLoaderCircle className="text-xl animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-2 border-black">
              <thead className="bg-zinc-200 dark:bg-zinc-600 dark:text-zinc-50">
                <tr>
                  <th scope="col" className="px-6 py-2 kanit-medium">
                    Agent
                  </th>
                  <th scope="col" className="px-6 py-2 kanit-medium">
                    Request
                  </th>
                  <th scope="col" className="px-6 py-2 kanit-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {agentList.map((item, index) => (
                  <tr key={index} className={`border-b hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-600 ${getLengtByAgent(item.agent_id) === 0 ? "hidden" : ""}`}>
                    <th scope="row" className="px-6 py-1 kanit-regular">
                      {item.name}
                    </th>
                    <td className="px-6 py-1">
                      {getLengtByAgent(item.agent_id)}
                    </td>
                    <td className="px-6 py-1 kanit-regular">
                      {rupiah.format(getTotalByAgent(item.agent_id))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-zinc-200 dark:bg-zinc-600 dark:text-zinc-50">
                  <th scope="row" className="px-6 py-2 kanit-medium">
                    Grand Total
                  </th>
                  <td className="px-6 py-2 kanit-medium">
                    {totalSuccessWd.length}
                  </td>
                  <td className="px-6 py-2 kanit-medium">
                    {rupiah.format(grandTotalWd())}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
