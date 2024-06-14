import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, pluck } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { GroupCourse } from 'src/app/model/semester';
import { Title } from 'src/app/model/ui';
import { LoadStatisticsAction } from 'src/app/reducer/risk/risk.action';
import { SetActiveGroupAction } from 'src/app/reducer/semester/semester.actions';
import { BossService } from 'src/app/services/boss.service';

@Component({
  selector: 'app-course-boss',
  templateUrl: './course-boss.component.html',
  styleUrls: ['./course-boss.component.css'],
})
export class CourseBossComponent implements OnInit, OnDestroy {
  title: Title = {
    title: '',
    subtitle: '',
  };

  subscription: Subscription = new Subscription();
  group: GroupCourse = null;

  constructor(
    private store: Store<AppState>,
    private bossService: BossService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    const code = this.route.snapshot.paramMap.get('code');
    const group = this.route.snapshot.paramMap.get('group');
    this.store.dispatch(
      new LoadStatisticsAction({
        code,
        group,
        risk: null,
      })
    );
    this.loadGroups(code, group);
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('semester')
      .pipe(
        pluck('active'),
        filter((active) => active !== null)
      )
      .subscribe((active) => {
        this.group = active;
        this.title = {
          title: `${active.nombre} - ${active.grupo}`,
          subtitle: `Docente - ${active.nombredocente} ${active.apellidodocente}`,
        };
      });
  }

  async loadGroups(code: String, group: String) {
    const codeProgram = code.slice(0, -4);
    const codeCourse = code.slice(-4);
    const res = await this.bossService.getGroup(codeProgram, codeCourse, group);
    if (res.ok) {
      this.store.dispatch(new SetActiveGroupAction(res.data));
    } else {
      this.location.back();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
