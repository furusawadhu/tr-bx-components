import { useState, useEffect } from "react";
import {
  ActorCard,
  BaseLayout,
  ScrollableList,
  Modal,
  ActorInfo,
} from "@d7lab/bx-components-react";

export const ActorModalCard = () => {
  // どのAPIのレスポンスを持っているか、Modalを表示するかなどを管理するためにuseStateでstateを作成します。
  const [response, setResponse] = useState(); // コンポーネントが受け取ったAPIのレスポンスを管理するstate
  const [openModal, setOpenModal] = useState(false); // Modalを表示するか否かを管理するstate
  const [selectedActorIndex, setSelectedActorIndex] = useState(null); // どこのActorCardがclickされたかを管理するstate

  // APIを取得する関数
  const fetchAPI = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // "APIを取得する関数"の実行
  useEffect(() => {
    fetchAPI(
      "https://api.nr.nhk.jp/r7/t/nplaylist/pl/series-tep-R7Y6NGLJ6G.json"
    );
  }, []);

  // 画面上に表示するActorCardのリスト
  return (
    <>
      {response ? (
        <>
          <BaseLayout>
            <ScrollableList>
              {response.actor.map((e, index) => (
                <>
                  <ActorCard
                    key={index}
                    content={e}
                    customStyles={{ width: 200, m: "A" }}
                    onClick={() => {
                      setSelectedActorIndex(index);
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
      {selectedActorIndex !== null && (
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <ActorInfo content={response.actor[selectedActorIndex]} />
        </Modal>
      )}
    </>
  );
};
