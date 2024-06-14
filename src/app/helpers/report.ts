import { Canvas, Item, Line, Ul, Txt, Table, ITable } from 'pdfmake-wrapper';
import { User } from '../model/auth';
import { normalizeRoles, parseDate } from './ui';

type TableRow = [Number, String, String, String, String, String];

const createReportBinnacle = (data: any[]) => {
  const binnacle = createUIBinnacle(data);
  binnacle.pop();
  return new Ul([...binnacle]).markerColor('#bb0b20').end;
};

const createUIBinnacle = (data: any[]) =>
  data
    .map(
      (x) =>
        new Item(
          new Txt(
            `${normalizeRoles(x.role)}: ${x.text}.\n ${parseDate(
              new Date(x.date)
            )}`
          )
            .bold()
            .margin([20, 20]).end
        ).end
    )
    .reduce(
      (acc, cur) =>
        (acc = [
          ...acc,
          cur,
          new Canvas([new Line([10, 0], [500, 0]).lineColor('#bb0b20').end])
            .end,
        ]),
      []
    );

const createTableActivity = (data: User[]): ITable =>
  new Table([
    //Header
    [
      new Txt('#').fontSize(14).bold().end,
      new Txt('Código').fontSize(14).bold().end,
      new Txt('Nombre').fontSize(14).bold().end,
      new Txt('Correo').fontSize(14).bold().end,
      new Txt('Programa').fontSize(12).bold().end,
      new Txt('Firma').fontSize(12).bold().end,
    ],
    //Data
    ...extractDateActivity(data),
  ])
    .alignment('center')
    .heights(() => 50)
    .widths(['2%', '16%', 'auto', 'auto', 'auto', '20%'])
    .layout({
      fillColor: () => '#f3f0ee',
    }).end;

const extractDateActivity = (data: User[]): TableRow[] =>
  data.map((student, i) => [
    i + 1,
    student.codigo,
    `${student.nombre} ${student.apellido}`,
    student.correo,
    student.programa,
    '',
  ]);

export { createReportBinnacle, createTableActivity };
