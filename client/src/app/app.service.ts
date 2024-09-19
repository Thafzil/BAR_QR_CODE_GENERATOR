import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, map } from "rxjs";

// -------------Comment this line if you want to run the local server
// const remote_api_url='https://sarda2t-server-miniproject-cevygypb6q-uc.a.run.app'

// ------------- Uncomment the below line to run local server and Comment this line if you want remote server
const remote_api_url = "http://localhost:8083";

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(private http: HttpClient) {}

  private badgeCount = new BehaviorSubject<number>(0);
  currentBadgeCount = this.badgeCount.asObservable();

  updateBadgeCount() {
    this.getSavedCount().subscribe({
      next: (res) => this.badgeCount.next(res["count"]),
    });
  }

  getBadgeCount(): number {
    return this.badgeCount.value;
  }

  loginSrv(username: string, password: string) {
    const formData = new FormData();
    formData.append("email", username);
    formData.append("password", password);
    return this.http.post(remote_api_url + "/login", formData);
  }

  signup(
    name: string,
    username: string,
    password: string,
    password_confirm: string
  ) {
    const formData = new FormData();
    formData.append("fullname", name);
    formData.append("email", username);
    formData.append("password1", password);
    formData.append("password2", password_confirm);
    return this.http.post(remote_api_url + "/", formData);
  }

  isLoggedIn(): boolean {
    return (
      localStorage.getItem("user") !== null &&
      localStorage.getItem("user_name") !== null
    );
  }

  saveToDB(imgs_blob) {
    const body = { user: localStorage.getItem("user"), images: imgs_blob };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return this.http.post(remote_api_url + "/save_to_db", body, { headers });
  }

  getFromDB() {
    const body = { user: localStorage.getItem("user") };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return this.http.post(remote_api_url + "/get_from_db", body, { headers });
  }

  deleteFromDB(imageName, imageType) {
    const body = {
      user: localStorage.getItem("user"),
      image_name: imageName,
      image_type: imageType,
    };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return this.http.post(remote_api_url + "/delete_from_db", body, {
      headers,
    });
  }

  deleteAllFromDB() {
    const body = { user: localStorage.getItem("user") };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return this.http.post(remote_api_url + "/delete_all_images", body, {
      headers,
    });
  }

  getSavedCount() {
    const body = { user: localStorage.getItem("user") };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return this.http.post(remote_api_url + "/get_saved_count", body, {
      headers,
    });
  }

  generateBarcode(text: string) {
    const body = { text };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    return this.http.post(remote_api_url + "/barcode", body, {
      headers,
      responseType: "blob",
    });
  }

  generateQRcode(text: string) {
    const body = { text };
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(remote_api_url + "/qrcode", body, {
      headers,
      responseType: "blob",
    });
  }

  generateBarcodes(csvFile: File): any {
    const url = remote_api_url + "/barcode_csv";
    // const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    const formData = new FormData();
    formData.append("csv_file", csvFile);
    return this.http.post<string[]>(url, formData);
  }

  generateQRcodes(csvFile: File): any {
    const url = remote_api_url + "/qrcode_csv";
    // const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    const formData = new FormData();
    formData.append("csv_file", csvFile);
    return this.http.post<string[]>(url, formData);
  }

  decodeBarcode(image: File) {
    const url = remote_api_url + "/decode_barcode";
    // const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    const formData = new FormData();
    formData.append("image", image);
    return this.http.post<string[]>(url, formData);
  }

  decodeQrcode(image: File) {
    const url = remote_api_url + "/decode_qrcode";
    // const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
    const formData = new FormData();
    formData.append("image", image);
    return this.http.post<string[]>(url, formData);
  }
}
