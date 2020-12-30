import algoliasearch from "algoliasearch";

const { APP_KEY, ADMIN_KEY, INDEX_NAME } = process.env;

// algolia
const client = algoliasearch(APP_KEY, ADMIN_KEY);
const index = client.initIndex(INDEX_NAME);

// insert data to algolia

export const insertToAlgolia = async ({ _id, title, price }) => {
  await index.saveObject(
    {
      title,
      price,
      objectID: _id,
    }
    // { autoGenerateObjectIDIfNotExist: true }
  );
};

export const deleteFromAlgolia = async (id) => {
  await index.deleteObject(id);
};

export const updateToAlgolia = async ({ _id, title, price }) => {
  await index.partialUpdateObject({
    objectID: _id,
    title,
    price,
  });
};
