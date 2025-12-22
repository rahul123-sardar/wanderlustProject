
const dataList=require("./data.js");

use("wonderlust");


async function insert() {
    db.listings.deleteMany({});
dataList.data=dataList.data.map((obj) => {
    obj.owner = '6942858ec40b74a915d53351';
});

   await db.listings.insertMany(dataList.data);
};

insert();


