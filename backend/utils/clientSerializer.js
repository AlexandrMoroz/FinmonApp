function ClientSerialize(client) {
  let dateOfPEP;
  if (client.PEP && client.PEP.length != 0) {
    dateOfPEP = client.PEP.sort(
      (a, b) =>
        new Date(a.DateOfNown).getTime() - new Date(b.DateOfNown).getTime()
    )[0].DateOfNown;
    dateOfPEP = new Date(dateOfPEP).toLocaleDateString("en-GB");
  } else {
    dateOfPEP = "X";
  }
  let risk;
  if (client.ClienRisk && client.ClienRisk.length != 0) {
    risk = client.ClienRisk.map((item) => {
      return [item.Risk, item.OnCreateDate];
    });
  } else {
    risk = [["X", "X"]];
  }
  let temp = {
    firstcontact: client.DateOfFirstBissnesContact,
    pep: client.PEP ? client.PEP.length != 0 : "X",
    dateOfPEP,
    risk,
  };
  if (client.ShortName) {
    temp = {
      name: client.ShortName,
      code: client.ClientCode,
      organizationForm: "юридична особа",
      resident: client.isResident ? "резидент" : "нерезидент",
      regist: client?.RegistPlace?.Country,
      live: client?.ActualLocation?.Country,
      ...temp,
    };
  } else {
    temp = {
      name: `${client.Name} ${client.Family} ${client.Surname}`,
      code: client.INN,
      organizationForm: "фізична особа",
      resident: client.isResident ? "резидент" : "нерезидент",
      regist: client.Regist.Country,
      live: client.Live.Country,
      ...temp,
    };
  }
  return temp;
}

module.exports = ClientSerialize;
