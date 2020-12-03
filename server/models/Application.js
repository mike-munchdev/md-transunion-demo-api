const mongoose = require('mongoose');
const { default: validatorF } = require('validator');
const {
  applicantSchema,
  creditorsSchema,
  incomeSchema,
  expenseSchema,
} = require('./subDocuments');

const ApplicationSchema = new mongoose.Schema({
  applicant: applicantSchema,
  coApplicant: applicantSchema,
  creditors: [creditorsSchema],
  income: [incomeSchema],
  expenses: [expenseSchema],
  bankName: { type: String },
  bankRoutingNumber: { type: String },
  bankAccountNumber: { type: String },
  bankAccountType: { type: String },
  dayToMakePayment: { type: Number },
  secondDayToMakePayment: { type: Number },
  monthToStart: { type: Number },
  contract: { type: String },
  supportingDocuments: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TODO: encrypt ssn in database;
ApplicationSchema.method('transform', function () {
  let obj = this.toObject();
  console.log('ApplicationSchema transform');
  //Rename fields
  obj.id = obj._id;

  if (obj.applicant) {
    obj.applicant.id = obj.applicant._id;
    delete obj.applicant._id;
  }
  if (obj.coApplicant) {
    obj.coApplicant.id = obj.coApplicant._id;
    delete obj.coApplicant._id;
  }

  if (obj.creditors) {
    obj.creditors = obj.creditors.map((c) => {
      c.id = c._id;
      delete c._id;
      return c;
    });
  }
  if (obj.income) {
    obj.income = obj.income.map((i) => {
      i.id = i._id;
      delete i._id;
      return i;
    });
  }
  if (obj.expenses) {
    obj.expenses = obj.expenses.map((e) => {
      e.id = e._id;
      delete e._id;
      return e;
    });
  }

  delete obj._id;

  return obj;
});

module.exports = mongoose.model('Application', ApplicationSchema);
