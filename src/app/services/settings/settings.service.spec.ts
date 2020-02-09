import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { SettingsService } from './settings.service';
import { createStorageMock } from '@test/mocks';

describe('SettingsService', () => {
  let service: SettingsService;
  let storage;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useFactory: createStorageMock }]
    });
    storage = TestBed.inject(Storage);
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('useBiometrics', () => {
    it('uses the biometrics key', () => {
      service.useBiometrics();
      expect(storage.get).toHaveBeenCalledTimes(1);
      expect(storage.get).toHaveBeenCalledWith('useBiometrics');
    });

    [true, false].forEach(value =>
      it('returns the currently set value', async () => {
        storage.get.withArgs('useBiometrics').and.returnValue(Promise.resolve(value));
        expect(await service.useBiometrics()).toEqual(value);
      })
    );
  });

  describe('usePasscode', () => {
    it('uses the passcode key', () => {
      service.usePasscode();
      expect(storage.get).toHaveBeenCalledTimes(1);
      expect(storage.get).toHaveBeenCalledWith('usePasscode');
    });

    [true, false].forEach(value =>
      it('returns the currently set value', async () => {
        storage.get.withArgs('usePasscode').and.returnValue(Promise.resolve(value));
        expect(await service.usePasscode()).toEqual(value);
      })
    );
  });

  describe('useSecureStorageModule', () => {
    it('uses the secure storage module key', () => {
      service.useSecureStorageMode();
      expect(storage.get).toHaveBeenCalledTimes(1);
      expect(storage.get).toHaveBeenCalledWith('useSecureStorageMode');
    });

    [true, false].forEach(value =>
      it('returns the currently set value', async () => {
        storage.get.withArgs('useSecureStorageMode').and.returnValue(Promise.resolve(value));
        expect(await service.useSecureStorageMode()).toEqual(value);
      })
    );
  });

  describe('store', () => {
    [
      {
        useBiometrics: true,
        usePasscode: false,
        useSecureStorageMode: false
      },
      {
        useBiometrics: true,
        usePasscode: true,
        useSecureStorageMode: false
      },
      {
        useBiometrics: false,
        usePasscode: false,
        useSecureStorageMode: true
      },
      {
        useBiometrics: false,
        usePasscode: false,
        useSecureStorageMode: false
      },
      {
        useBiometrics: false,
        usePasscode: true,
        useSecureStorageMode: false
      }
    ].forEach(value =>
      it('stores the values', async () => {
        await service.store(value);
        expect(storage.set).toHaveBeenCalledTimes(3);
        expect(storage.set).toHaveBeenCalledWith('useBiometrics', value.useBiometrics);
        expect(storage.set).toHaveBeenCalledWith('usePasscode', value.usePasscode);
        expect(storage.set).toHaveBeenCalledWith('useSecureStorageMode', value.useSecureStorageMode);
      })
    );
  });
});
