class AppointmentFactory {
  Build(simple) {
    let day = simple.date.getDate() + 1;
    let month = simple.date.getMonth();
    let year = simple.date.getFullYear();

    let hour = Number.parseInt(simple.time.split(":")[0]);
    let minutes = Number.parseInt(simple.time.split(":")[1]);

    let date = new Date(year, month, day, hour, minutes, 0, 0);
    let appo = {
      id: simple._id,
      title: simple.name + " - " + simple.description,
      start: date,
      end: date,
      notified: simple.notified,
      email: simple.email,
    };
    return appo;
  }
}
module.exports = new AppointmentFactory();
