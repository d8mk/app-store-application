import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Filter() {
  const [thresholdDate, setThresholdDate] = useState(
    localStorage.getItem("thresholdDate") || ""
  );
  const [updatedDate, setUpdatedDate] = useState(
    localStorage.getItem("updatedDate") || ""
  );
  const [apps, setApps] = useState([]);
  const [releasedApps, setReleasedApps] = useState([]);
  const [updatedApps, setUpdatedApps] = useState([]);

  const fetchApps = async () => {
    try {
      const response = await fetch(
        `https://app-store-application.vercel.app/api/app/full-details`
      );
      const appsData = await response.json();

      const userDate = new Date(thresholdDate);

      const releasedApp = appsData.filter((app) => {
        const appReleasedDate = new Date(app.released);
        return appReleasedDate >= userDate;
      });

      const userUpdatedDate = new Date(updatedDate);

      const updatedApp = appsData.filter((app) => {
        const appUpdatedDate = new Date(app.updated);
        return appUpdatedDate >= userUpdatedDate;
      });

      setApps(appsData);
      setReleasedApps(releasedApp);
      setUpdatedApps(updatedApp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    localStorage.setItem("thresholdDate", thresholdDate);
  }, [thresholdDate]);

  useEffect(() => {
    localStorage.setItem("updatedDate", updatedDate);
  }, [updatedDate]);

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">App Store Apps</h1>
      <div className="mb-4 space-x-4">
        <label htmlFor="thresholdDate" className="font-medium">
          Threshold Date:
        </label>
        <input
          type="date"
          id="thresholdDate"
          value={thresholdDate}
          onChange={(e) => setThresholdDate(e.target.value)}
          className="border rounded-md p-2"
        />
        <label htmlFor="updatedDate" className="font-medium">
          Updated Date:
        </label>
        <input
          type="date"
          id="updatedDate"
          value={updatedDate}
          onChange={(e) => setUpdatedDate(e.target.value)}
          className="border rounded-md p-2"
        />
        <button
          onClick={fetchApps}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Filter Apps
        </button>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Released Apps</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Release Date</th>
            </tr>
          </thead>
          <tbody>
            {releasedApps.map((app, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <Link to={`/details/${app.id}`} className="text-blue-500">
                    {app.title}
                  </Link>
                </td>
                <td className="p-2">{app.released}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Updated Apps</h2>
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Updated Date</th>
            </tr>
          </thead>
          <tbody>
            {updatedApps.map((app, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <Link to={`/details/${app.id}`} className="text-blue-500">
                    {app.title}
                  </Link>
                </td>
                <td className="p-2">{app.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
