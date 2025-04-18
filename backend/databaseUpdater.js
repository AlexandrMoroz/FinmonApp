const SanctionService = require("./services/sanction");
const TerroristService = require("./services/terrorist");
const { connect } = require("mongoose");
const { devConfig } = require("./config/index");

(async function () {
   try{ connect(devConfig.DB, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
      console.log({
        message: `Successfully connected with the Database \n${devConfig.DB}`,
        badge: true,
      });
  let terroristService = new TerroristService();
  let sanctionService = new SanctionService();
  let flag = await terroristService.updateFromSite();
  let flag2 = await sanctionService.updateFromSite();
  console.log(flag);
  console.log(flag2);}
  catch(err){
    console.log(err);
  }
})();
