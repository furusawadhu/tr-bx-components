// APIをfetchする関数
export const fetchAPI = async (url, callback) => {
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
export const fetchExtendedAPI = async (url, callback, list = null, query) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    callback((prevList) => [...prevList, { id: query, data: data }]);
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// idを指定してactor[]からpersonまたはorganizationを取得する関数
export function getActorDataById(actorArray, targetId) {
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

// オブジェクトのリストからidを指定してデータを取得する関数
export function getExtendedDataById(listOfObjects, id) {
  const foundObject = listOfObjects.find((obj) => obj.id === id);
  return foundObject ? foundObject.data : null;
}
