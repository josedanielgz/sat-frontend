import { Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { User } from '../model/auth';
import { getColor, parseDate } from './ui';

type TableRow = [Number, String, String, String, String, String];
type TableRowSuggestion = [
  Number,
  String,
  String,
  String,
  String,
  String,
  String
];

// Alumnos
const generatePDF = async (data: any[], text: String, creator: Function) => {
  const pdf = new PdfMakeWrapper();
  const dateString = parseDate();
  pdf.header(
    new Txt(dateString)
      .fontSize(10)
      .color('gray')
      .margin([20, 20])
      .alignment('right').end
  );

  pdf.footer(
    (currentPage) =>
      new Txt(`UFPS Cúcuta, Norte de Santander - Página ${currentPage}`)
        .fontSize(10)
        .color('black')
        .bold()
        .margin([20, 0])
        .alignment('right').end
  );

  pdf.add(
    await new Img('http://localhost:4200/assets/image/Logo_SAT.svg')
      .alignment('center')
      .build()
  );

  pdf.add(
    new Txt('SAT').fontSize(20).color('#353343').bold().alignment('center').end
  );

  pdf.add(
    new Txt(text.toString()).margin([0, 20]).fontSize(12).color('black').bold()
      .end
  );

  pdf.add(creator(data));
  pdf.create().open({});
};

const createTable = (data: User[]): ITable =>
  new Table([
    //Header
    [
      new Txt('#').fontSize(14).bold().end,
      new Txt('Código').fontSize(14).bold().end,
      new Txt('Nombre').fontSize(14).bold().end,
      new Txt('Correo').fontSize(14).bold().end,
      new Txt('Riesgo').fontSize(14).bold().end,
      new Txt('Estado').fontSize(14).bold().end,
    ],
    //Data
    ...extractDate(data),
  ])
    .alignment('center')
    .heights(() => 50)
    .widths(['2%', '16%', 'auto', 'auto', '16%', 'auto'])
    .layout({
      defaultBorder: false,
      fillColor: () => '#f3f0ee',
    }).end;

const extractDate = (data: User[]): TableRow[] =>
  data.map((student, i) => [
    i + 1,
    student.codigo,
    `${student.nombre} ${student.apellido}`,
    student.correo.split('@')[0],
    getColor(student.riesgo).risk.toUpperCase(),
    student.estado.toUpperCase(),
  ]);

// Sugerencias
const createTableSuggestion = (data: any[]): ITable =>
  new Table([
    //Header
    [
      new Txt('#').fontSize(12).bold().end,
      new Txt('Código').fontSize(12).bold().end,
      new Txt('Correo').fontSize(12).bold().end,
      new Txt('Programa').fontSize(12).bold().end,
      new Txt('Beneficio').fontSize(12).bold().end,
      new Txt('Administrativo').fontSize(12).bold().end,
      new Txt('Fecha').fontSize(12).bold().end,
    ],
    //Data
    ...extractDateSuggestion(data),
  ])
    .alignment('center')
    .heights(() => 50)
    .widths(['2%', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'])
    .layout({
      defaultBorder: false,
      fillColor: () => '#f3f0ee',
    }).end;

const extractDateSuggestion = (data: any[]): TableRowSuggestion[] =>
  data.map((suggestion, i) => [
    i + 1,
    suggestion.student.codigo,
    suggestion.student.correo.split('@')[0],
    suggestion.student.programa,
    suggestion.profit.nombre,
    `${suggestion.admin.nombre} ${suggestion.admin.apellido}`,
    `${new Date(suggestion.date).toISOString().slice(0, 10)}`,
  ]);

export { generatePDF, createTableSuggestion, createTable };
