import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../model/auth';

@Pipe({
  name: 'filterStudent',
})
export class FilterStudentPipe implements PipeTransform {
  transform(students: User[], filter: String): User[] {
    if (!filter) return students;
    filter = filter.toLowerCase();
    return students.filter(
      (student) =>
        student.estado.toLowerCase() === filter ||
        student.codigo.toLowerCase() === filter ||
        `${student.nombre} ${student.apellido}`
          .toLowerCase()
          .includes(filter.toString()) ||
        student.nombre.toLowerCase().includes(filter.toString()) ||
        student.apellido.toLowerCase().includes(filter.toString())
    );
  }
}
