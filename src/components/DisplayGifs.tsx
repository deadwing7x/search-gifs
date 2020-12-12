/* eslint-disable react-hooks/exhaustive-deps */
import React, { CSSProperties, FC, useEffect, useState } from "react";
import { useIsMount } from "./IsMount";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

// API key for making calls to the Giphy API
const apiKey: string = "gtAApH9jJnrHcrhPTbYsve7Qukh0yRg6";

// Fetch data from the Giphy API on the specified query, offset and rating
const fetchData: any = async (
  query: string,
  offSet: number,
  rating: string
) => {
  rating = rating === "" ? "g" : rating;
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=12&offset=${offSet}&rating=${rating}&lang=en`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

// Fetch trending data from the Giphy API
const fetchTrending: any = async (limit: number, rating: string) => {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=gtAApH9jJnrHcrhPTbYsve7Qukh0yRg6&limit=${limit}&rating=${rating}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

// Fetch random data from the Giphy API
const fetchRandom: any = async () => {
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/random?api_key=gtAApH9jJnrHcrhPTbYsve7Qukh0yRg6&tag=&rating=g`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

//#region CSS Properties
const imageProperties: CSSProperties = {
  width: "200px",
  height: "200px",
};

const imagePropertiesForRandom: CSSProperties = {
  width: "500px",
  height: "500px",
};

const listStyle: CSSProperties = {
  margin: "0 auto",
  textAlign: "center",
  columnCount: 4,
  listStyleType: "none",
};

const listItemStyle: CSSProperties = {
  display: "block",
  verticalAlign: "top",
};

const inputStyle: CSSProperties = {
  width: "300px",
  height: "30px",
  fontSize: "24px",
  marginBottom: "5rem",
  borderRadius: "7px",
};

const buttonStyle: CSSProperties = {
  marginLeft: "1rem",
  width: "120px",
  marginBottom: "5rem",
  height: "35px",
  fontSize: "23px",
  backgroundColor: "beige",
  cursor: "pointer",
  borderRadius: "5px",
};

const loadMoreButtonStyle: CSSProperties = {
  width: "150px",
  height: "50px",
  fontSize: "20px",
  marginTop: "1rem",
  backgroundColor: "beige",
  cursor: "pointer",
  borderRadius: "5px",
  marginLeft: "2rem",
};
//#endregion

// Display Gifs Component
const DisplayGifs: FC<{}> = () => {
  const isMount = useIsMount();
  const [searchKey, setSearchKey] = useState<string>("");
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiCallOngoing, setApiCallOngoing] = useState<boolean>(false);
  const [rating, setRating] = useState<string>("g");
  const [randomClicked, setRandomClicked] = useState<boolean>(false);
  const [trendingClicked, setTrendingClicked] = useState<boolean>(false);
  const [randomData, setRandomData] = useState<any>();

  useEffect(() => {
    if (!isMount) {
      if (searchKey.length === 0) {
        setLoading(true);
        setApiCallOngoing(false);
      } else if (searchKey.length > 0) {
        startSearch();
      }
    }
  }, [searchKey, rating]);

  // Render the API result
  const displayResult = randomClicked ? (
    <div>
      <a
        href={randomData.url}
        style={imagePropertiesForRandom}
        rel="noreferrer"
        target="_blank"
      >
        <picture>
          <source
            type="image/webp"
            style={imagePropertiesForRandom}
            srcSet={randomData.images.original.webp}
          ></source>
          <img
            alt={`gif-${randomData.id}`}
            style={imagePropertiesForRandom}
            src={randomData.images.original.url}
          ></img>
        </picture>
      </a>
    </div>
  ) : (
    <div style={listStyle}>
      {result.map((item: any) => (
        <span>
          <li id={item.id} key={item.id} style={listItemStyle}>
            <a
              href={item.url}
              style={imageProperties}
              rel="noreferrer"
              target="_blank"
            >
              <picture>
                <source
                  type="image/webp"
                  style={imageProperties}
                  srcSet={item.images.original.webp}
                ></source>
                <img
                  alt={`gif-${item.id}`}
                  style={imageProperties}
                  src={item.images.original.url}
                ></img>
              </picture>
            </a>
          </li>
        </span>
      ))}
    </div>
  );

  // Render the radio group for selecting the desired rating standard
  const radioGroup = (
    <div>
      <FormControl component="fieldset">
        <FormLabel style={{ color: "white" }} component="legend">
          Select Ratings Level:
        </FormLabel>
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue="top"
          style={{ marginBottom: "1.5rem" }}
        >
          <FormControlLabel
            value="g"
            control={
              <Radio
                checked={rating === "g"}
                onChange={(event) => {
                  setRating(event.target.value);
                }}
                color="primary"
              />
            }
            label="G"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="pg"
            control={
              <Radio
                checked={rating === "pg"}
                onChange={(event) => {
                  setRating(event.target.value);
                }}
                color="primary"
              />
            }
            label="PG"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="pg-13"
            control={
              <Radio
                checked={rating === "pg-13"}
                onChange={(event) => {
                  setRating(event.target.value);
                }}
                color="primary"
              />
            }
            label="PG-13"
            labelPlacement="bottom"
          />
          <FormControlLabel
            value="r"
            control={
              <Radio
                checked={rating === "r"}
                onChange={(event) => {
                  setRating(event.target.value);
                }}
                color="primary"
              />
            }
            label="R"
            labelPlacement="bottom"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );

  // Load more gifs on click of the 'Load More' button
  const onClickHandler = () => {
    const offSet: number = 12 + result.length;
    setApiCallOngoing(true);
    setRandomClicked(false);
    setTrendingClicked(false);
    setLoading(true);
    const gifPromise = fetchData(searchKey, offSet, rating);
    gifPromise.then((res: any) => {
      setResult([...result, ...res.data]);
      setLoading(false);
      setApiCallOngoing(false);
    });
  };

  // Search for gifs using the input provided by the user
  const startSearch = () => {
    setRandomClicked(false);
    setTrendingClicked(false);
    if (searchKey.length > 0) {
      setApiCallOngoing(true);
      const gifPromise = fetchData(searchKey, 0, rating);
      gifPromise.then((res: any) => {
        setResult(res.data);
        setLoading(false);
        setApiCallOngoing(false);
      });
    } else {
      setApiCallOngoing(false);
      setLoading(true);
    }
  };

  // Display the trending gifs
  const getTrending = () => {
    setApiCallOngoing(true);
    setRandomClicked(false);
    setTrendingClicked(true);
    const gifPromise = fetchTrending(24, rating);
    gifPromise.then((res: any) => {
      setResult(res.data);
      setLoading(false);
      setApiCallOngoing(false);
    });
  };

  // Display any random gif
  const getRandom = () => {
    setApiCallOngoing(true);
    const gifPromise = fetchRandom();
    gifPromise.then((res: any) => {
      setRandomData(res.data);
      setRandomClicked(true);
      setLoading(false);
      setApiCallOngoing(false);
    });
  };

  return (
    <div>
      <div>
        <input
          style={inputStyle}
          type="text"
          placeholder="Feeling lucky?"
          onChange={(event) => {
            setSearchKey(event.target.value);
          }}
        />
        <div>{radioGroup}</div>
        <button style={buttonStyle} onClick={() => startSearch()}>
          Let's Go!
        </button>
        <div>
          <button style={buttonStyle} onClick={() => getTrending()}>
            Trending
          </button>
          <button style={buttonStyle} onClick={() => getRandom()}>
            Random
          </button>
        </div>
      </div>

      <div>
        {loading === false ? (
          <div>
            <div>{displayResult}</div>
            {randomClicked || trendingClicked ? (
              ""
            ) : (
              <button
                style={loadMoreButtonStyle}
                onClick={() => onClickHandler()}
              >
                Load More!
              </button>
            )}
          </div>
        ) : apiCallOngoing ? (
          "Please wait! Loading..."
        ) : (
          "Go ahead! Type it out..."
        )}
      </div>
    </div>
  );
};

export default DisplayGifs;
