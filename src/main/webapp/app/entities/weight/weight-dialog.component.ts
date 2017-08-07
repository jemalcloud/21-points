import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { Weight } from './weight.model';
import { WeightPopupService } from './weight-popup.service';
import { WeightService } from './weight.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-weight-dialog',
    templateUrl: './weight-dialog.component.html'
})
export class WeightDialogComponent implements OnInit {

    weight: Weight;
    authorities: any[];
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private weightService: WeightService,
        private userService: UserService,
        private eventManager: EventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.weight.id !== undefined) {
            this.subscribeToSaveResponse(
                this.weightService.update(this.weight), false);
        } else {
            this.subscribeToSaveResponse(
                this.weightService.create(this.weight), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Weight>, isCreated: boolean) {
        result.subscribe((res: Weight) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Weight, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'twentyOnePointsApp.weight.created'
            : 'twentyOnePointsApp.weight.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'weightListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-weight-popup',
    template: ''
})
export class WeightPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private weightPopupService: WeightPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.weightPopupService
                    .open(WeightDialogComponent, params['id']);
            } else {
                this.modalRef = this.weightPopupService
                    .open(WeightDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}