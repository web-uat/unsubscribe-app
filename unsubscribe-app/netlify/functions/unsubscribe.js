const { MongoClient, ObjectId } = require("mongodb");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { id, reason } = JSON.parse(event.body);
    if (!id || !reason) return { statusCode: 400, body: "Missing fields" };

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("tblleadrawdata").updateOne(
      { _id: new ObjectId(id) },
      { $set: { Status: "DND-Email", unsubscribereason: reason, unsubscribedAt: new Date() } }
    );

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, modified: result.modifiedCount })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
