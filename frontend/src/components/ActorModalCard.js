import { useState, useEffect } from "react";
import {
  ActorCard,
  BaseLayout,
  ScrollableList,
  Modal,
  ActorInfo,
  NPlaylistLargeImageCard,
  Text,
} from "@d7lab/bx-components-react";

export const ActorModalCard = () => {
  // どのAPIのレスポンスを持っているか、Modalを表示するかなどを管理するためにuseStateでstateを作成します。
  const [nplaylistInfo, setNPlaylistInfo] = useState(); // コンポーネントが受け取ったAPIのレスポンスを管理するstate
  const [extendedByNpgId, setExtendedByNpgId] = useState([]); // npgIdで検索した結果を管理する
  const [openModal, setOpenModal] = useState(false); // Modalを表示するか否かを管理するstate
  const [selectedActorId, setSelectedActorId] = useState(null); // どこのActorCardがclickされたかを管理するstate

  // APIを取得する関数
  const fetchAPI = async (url, callback) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      callback(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 検索API用の関数
  const fetchExtendedAPI = async (url, callback, list = null, query) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      callback((prevList) => [...prevList, { id: query, data: data }]);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // APIを取得する関数の実行
  useEffect(() => {
    fetchAPI(
      "https://api.nr.nhk.jp/r7/t/nplaylist/pl/series-tep-R7Y6NGLJ6G.json",
      setNPlaylistInfo
    );
  }, []);

  // APIの結果からnpgIdを取得し、追加で検索APIを叩く関数の実行
  useEffect(() => {
    if (nplaylistInfo) {
      nplaylistInfo.actor.forEach((e) => {
        if (e.person) {
          fetchExtendedAPI(
            `https://api.nr.nhk.jp/r7/s/extended2.json?modeOfItem=tv&type=nplaylist&npgId=${e.person.identifierGroup.npgId}`,
            setExtendedByNpgId,
            extendedByNpgId,
            e.person.identifierGroup.npgId
          );
        } else if (e.organization) {
          fetchExtendedAPI(
            `https://api.nr.nhk.jp/r7/s/extended2.json?modeOfItem=tv&type=nplaylist&npgId=${e.organization.identifierGroup.npgId}`,
            setExtendedByNpgId,
            extendedByNpgId,
            e.person.identifierGroup.npgId
          );
        }
      });
    }
  }, [nplaylistInfo]);

  // idを指定してactor[]からpersonまたはorganizationを取得する関数
  function getActorDataById(actorArray, targetId) {
    for (const actorItem of actorArray) {
      if (
        actorItem.person &&
        actorItem.person.identifierGroup.npgId === targetId
      ) {
        return actorItem;
      }
      if (
        actorItem.organization &&
        actorItem.organization.identifierGroup.npgId === targetId
      ) {
        return actorItem.organization;
      }
    }
    return null;
  }

  // extendedByNpgIdから対象のidを取得する関数
  function getExtendedDataById(listOfObjects, id) {
    const foundObject = listOfObjects.find((obj) => obj.id === id);
    return foundObject ? foundObject.data : null;
  }

  // 画面上に表示するActorCardのリスト
  return (
    <>
      {nplaylistInfo ? (
        <>
          <BaseLayout>
            <ScrollableList>
              {nplaylistInfo.actor.map((e, index) => (
                <>
                  <ActorCard
                    key={index}
                    content={e}
                    customStyles={{ width: 200, m: "A" }}
                    onClick={() => {
                      if (e.person) {
                        setSelectedActorId(e.person.identifierGroup.npgId);
                      } else if (e.organization) {
                        setSelectedActorId(
                          e.organization.identifierGroup.npgId
                        );
                      }
                      setOpenModal(true);
                    }}
                  />
                </>
              ))}
            </ScrollableList>
          </BaseLayout>
        </>
      ) : (
        <p>データを取得できませんでした</p>
      )}
      {selectedActorId !== null && (
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <ActorInfo
            content={getActorDataById(nplaylistInfo.actor, selectedActorId)}
          />
          <BaseLayout>
            <Text align="left" tag="h2" whiteSpace={{}}>
              出演シリーズ
            </Text>
            <ScrollableList>
              {getExtendedDataById(
                extendedByNpgId,
                selectedActorId
              )?.result.nplaylist.result.map((e, index) => (
                <NPlaylistLargeImageCard
                  ke={index}
                  content={e}
                  customStyles={{ width: 200, m: "A" }}
                  showPlaylistName
                />
              ))}
            </ScrollableList>
          </BaseLayout>
        </Modal>
      )}
    </>
  );
};
