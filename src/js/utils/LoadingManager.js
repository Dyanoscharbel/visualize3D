export class LoadingManager {
  constructor() {
    this.totalItems = 0;
    this.loadedItems = 0;
    this.callbacks = {
      progress: [],
      complete: [],
      error: []
    };
  }

  addItem() {
    this.totalItems++;
  }

  itemLoaded() {
    this.loadedItems++;
    this.updateProgress();
  }

  itemError(error) {
    this.loadedItems++;
    this.callbacks.error.forEach(callback => callback(error));
    this.updateProgress();
  }

  updateProgress() {
    const progress = this.totalItems > 0 ? (this.loadedItems / this.totalItems) * 100 : 0;
    
    this.callbacks.progress.forEach(callback => callback(progress));
    
    if (this.loadedItems >= this.totalItems && this.totalItems > 0) {
      this.callbacks.complete.forEach(callback => callback());
    }
  }

  onProgress(callback) {
    this.callbacks.progress.push(callback);
  }

  onComplete(callback) {
    this.callbacks.complete.push(callback);
  }

  onError(callback) {
    this.callbacks.error.push(callback);
  }

  reset() {
    this.totalItems = 0;
    this.loadedItems = 0;
  }
}
