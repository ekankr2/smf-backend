import crypto from "crypto";

export class CoupangService {
  private ACCESS_KEY: string;
  private SECRET_KEY: string;
  private BASE_URL: string;
  private VENDOR_ID: string;

  constructor() {
    this.ACCESS_KEY = process.env.COUPANG_ACCESS_KEY as string;
    this.SECRET_KEY = process.env.COUPANG_SECRET_KEY as string;
    this.VENDOR_ID = process.env.COUPANG_VENDOR_ID as string;
    this.BASE_URL = "https://proxy.smf.co.kr/coupang";
  }

  generateAuthorization = (method: string, path: string, query: string) => {
    const datetime =
      new Date().toISOString().slice(2, 19).replace(/[-:]/gi, "") + "Z";
    const message = `${datetime}${method}${path}${query}`;

    const signature = crypto
      .createHmac("sha256", this.SECRET_KEY)
      .update(message)
      .digest("hex");

    return `CEA algorithm=HmacSHA256, access-key=${this.ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;
  };

  OrderStatus = {
    결제완료: "ACCEPT",
    상품준비중: "INSTRUCT",
    배송지시: "DEPARTURE",
    배송중: "DELIVERING",
    배송완료: "FINAL_DELIVERY",
  };

  async getOrderSheets(
    startTime: string, // 2017-10-10 || 2017-09-29T00:00
    endTime: string,
    status: string,
  ) {
    const method = "GET";
    const path = `/v2/providers/openapi/apis/api/v4/vendors/${this.VENDOR_ID}/ordersheets`;
    const query = `createdAtFrom=${startTime}&createdAtTo=${endTime}&status=${status}`;
    const authorization = this.generateAuthorization(method, path, query);

    return await fetch(`${this.BASE_URL}${path}?${query}`, {
      method: method,
      headers: {
        Authorization: authorization,
        "X-EXTENDED-TIMEOUT": "90000",
      },
    });
  }

  async orderAcknowledgement(shipmentBoxIds: number[]) {
    const method = "PUT";
    const path = `/v2/providers/openapi/apis/api/v4/vendors/${this.VENDOR_ID}/ordersheets/acknowledgement`;
    const authorization = this.generateAuthorization(method, path, "");

    return await fetch(`${this.BASE_URL}${path}`, {
      method: method,
      headers: {
        Authorization: authorization,
        "X-EXTENDED-TIMEOUT": "90000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorId: this.VENDOR_ID,
        shipmentBoxIds: shipmentBoxIds,
      }),
    });
  }
}
