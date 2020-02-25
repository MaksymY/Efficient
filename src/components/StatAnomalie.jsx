import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { color } from "../style/const";
import axios from "axios";

const ContentAnomalie = styled.section`
  display: flex;
  flex-direction: column;
  margin: 44px;
  h1 {
    color: ${color.bluePrimary};
  }
  h2 {
    color: ${color.brandColor};
  }
`;

const GraphAnomalie = styled.section`
  display: block;
`;

const Anomalie = styled.div`
  display: flex;
  margin: 20px 20px 0 0;
  align-items: center;
  p {
    background-position: center 50px;
  }
`;

const AnomalieStat = styled.div`
  width: 100px;
  height: 32px;
  background-color: red;
  margin-right: 20px;
`;

const ExplaineAnomalie = styled.p`
  margin: 16px 0 32px 0;
  width: 340px;
  color: ${color.brandColor};
  span {
    color: ${color.fontInfos};
    font-weight: bold;
  }
`;

export const StatAnomalie = () => {
  const [results, setResults] = useState([]);
  const [dangerType, setDangerType] = useState();
  const [numAnomalie, setnumAnomalie] = useState([0, 0, 0]);

  useEffect(() => {
    const result = async () => {
      try {
        const { data } = await axios.get(
          "http://51.254.123.67/efficient-api/api/defects",
          {
            headers: {
              accept: "application/json"
            }
          }
        );
        data.map(value => {
          switch (value.Type) {
            case "Objets abandonnés":
              return (value.StatusDanger = "Très Génant");
            case "Mobiliers urbains":
              return (value.StatusDanger = "Très Génant");
            case "Graffitis, tags, affiches et autocollants":
              return (value.StatusDanger = "Génant");
            case "Propreté":
              return (value.StatusDanger = "Génant");
            default:
              return (value.StatusDanger = "Dangereux");
          }
        });
        setResults(data);
        const listOfTypes = new Set(
          data.map(({ StatusDanger: e }) => {
            return e;
          })
        );
        const clearedTypes = [];
        listOfTypes.forEach(type => {
          clearedTypes.push({ type });
        });
        setDangerType(clearedTypes);
        data.map(value => {
          if (value.StatusDanger === "Génant") {
            setnumAnomalie(++numAnomalie[0]);
          }
          if (value.StatusDanger === "Très Génant") {
            setnumAnomalie(++numAnomalie[1]);
          }
          if (value.StatusDanger === "Dangereux") {
            setnumAnomalie(++numAnomalie[2]);
          }
        });
        console.log(numAnomalie && numAnomalie);
        console.log("itwork");
      } catch (error) {
        console.log(error);
      }
    };
    result();
  }, []);

  const colorAnomalie = value => {
    switch (value) {
      case "Génant":
        return "#FFE664";
      case "Très Génant":
        return "#FFBC7E";
      default:
        return "#FF8181";
    }
  };

  const sizeAnomalie = value => {
    return (value * 100) / results.length;
  };

  return (
    <ContentAnomalie>
      <h1>Visualisation en direct</h1>
      <ExplaineAnomalie>
        Durant les 24 dernières heures, <span>{results.length}</span> anomalies
        ont été signalées dans les rues de Paris.
      </ExplaineAnomalie>
      <h2>Dont ...</h2>
      <GraphAnomalie>
        <Anomalie>
          <AnomalieStat
            style={{
              backgroundColor: colorAnomalie(dangerType && dangerType[0].type),
              width: `${sizeAnomalie(numAnomalie && numAnomalie)}%`
            }}
          ></AnomalieStat>
          <p
            style={{
              background: colorAnomalie(dangerType && dangerType[0].type)
            }}
          >
            {numAnomalie && numAnomalie} {dangerType && dangerType[0].type}
          </p>
        </Anomalie>
      </GraphAnomalie>
    </ContentAnomalie>
  );
};