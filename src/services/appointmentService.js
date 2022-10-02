const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactor");
const Appo = mongoose.model("Appointment", appointment);
const nodemailer = require("nodemailer");
class AppointmentService {
  async Create(name, email, description, cpf, date, time) {
    let newAppo = new Appo({
      name,
      email,
      description,
      cpf,
      date,
      time,
      finished: false,
      notified: false,
    });
    try {
      await newAppo.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async GetAll(showFinished) {
    if (showFinished) {
      return await Appo.find();
    } else {
      let appos = await Appo.find({ finished: false });
      let appointments = [];
      appos.map((e) => {
        appointments.push(AppointmentFactory.Build(e));
      });
      return appointments;
    }
  }
  async GetById(id) {
    try {
      let event = await Appo.findOne({ _id: id });
      return event;
    } catch (error) {
      console.log(error);
    }
  }
  async Finish(id) {
    try {
      if (id == undefined) {
        return false;
      }
      await Appo.findByIdAndUpdate(id, { finished: true });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async Search(query) {
    try {
      let appos = await Appo.find().or([{ email: query }, { cpf: query }]);
      return appos;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async SendNotification() {
    let appos = await this.GetAll(false);
    let transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "be556e5f35c20c",
        pass: "bfcae89991be9f",
      },
    });
    appos.map(async (app) => {
      let date = app.start.getTime();
      let hour = 1000 * 60 * 60;
      let gap = date - Date.now();
      if (gap <= hour) {
        if (!app.notified) {
          await Appo.findByIdAndUpdate(app.id, { notified: true });
          transport
            .sendMail({
              from: "William <contato@wluqui.com>",
              to: app.email,
              subject: "Sua consulta irá acontecet em breve !",
              text: "Sua consulta acontecera em 1HR ",
            })
            .then(() => {})
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });

    console.log(appos);
  }
}
module.exports = new AppointmentService();
