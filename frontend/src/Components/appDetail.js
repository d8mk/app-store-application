import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RatingsChart from "./ratingchart";

export default function AppDetail() {
  const { appId } = useParams();
  const [appDetails, setAppDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsFetched, setRatingsFetched] = useState(false);
  const [sentimentLabel, setSentimentLabel] = useState("");

  function sentimentAnalysis() {
    const Sentiment = require("sentiment");

    const sentiment = new Sentiment();

    const sentiments = reviews.map((review) => sentiment.analyze(review.text));

    const last10Sentiments = sentiments.slice(-10);
    const totalScore = last10Sentiments.reduce(
      (sum, sentiment) => sum + sentiment.score,
      0
    );

    const averageScore = totalScore / last10Sentiments.length;

    const sentimentLabel =
      averageScore > 0 ? "Positive" : averageScore < 0 ? "Negative" : "Neutral";

    setSentimentLabel(sentimentLabel);
  }

  const fetchAppDetails = async () => {
    try {
      const response = await fetch(
        `https://api-backend-kappa.vercel.app/api/details?id=${appId}`
      );
      if (response.ok) {
        const data = await response.json();
        setAppDetails(data);
      } else {
        console.error("Failed to fetch app details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAppReviews = async () => {
    try {
      const response = await fetch(
        `https://api-backend-kappa.vercel.app/api/reviews?id=${appId}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.slice(0, 10));
      } else {
        console.error("Failed to fetch app reviews");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAppRatings = async () => {
    try {
      const response = await fetch(
        `https://api-backend-kappa.vercel.app/api/ratings?id=${appId}`
      );
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
        setRatingsFetched(true);
      } else {
        console.error("Failed to fetch app ratings");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAppDetails();
    fetchAppReviews();
    fetchAppRatings();
    window.scrollTo(0, 0);
  }, [appId]);

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">App Details</h2>
      <div className="bg-white rounded-md shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">{appDetails.title}</h3>
        <p className="text-gray-600">{appDetails.description}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">App Reviews</h2>
      <div className="bg-white rounded-md shadow-md p-4 mb-6">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Text</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 font-medium">{review.title}</td>
                <td className="p-2">{review.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mb-4">App Ratings</h2>
      <div className="bg-white rounded-md shadow-md p-4">
        {ratingsFetched ? (
          <RatingsChart ratings={ratings} />
        ) : (
          <p>Loading ratings...</p>
        )}
      </div>

      <div className="bg-gray-100 p-6 min-h-screen">
        <div className="flex justify-center">
          <button
            onClick={sentimentAnalysis}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Get Feedback
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {sentimentLabel ? (
            <p>Sentiment of the last 10 reviews: {sentimentLabel}</p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
