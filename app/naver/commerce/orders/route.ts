import { NextRequest, NextResponse } from "next/server";
import { NaverCommerceService } from "@/services/NaverCommerceService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

/**
 * @swagger
 * /naver/commerce/orders:
 *   get:
 *     summary: 주문 목록
 *     tags: [네이버]
 *     responses:
 *       200:
 *         description: OK
 */
export async function GET(request: NextRequest) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const naverService = new NaverCommerceService();
  const from = dayjs()
    .tz("Asia/Seoul")
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  const to = dayjs()
    .tz("Asia/Seoul")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  try {
    const response = await naverService.getOrdersByConditions(
      from,
      naverService.orderRangeType.주문일시,
      naverService.productOrderStatuses.결제완료,
      naverService.placeOrderStatusType.발주확인,
      to,
    );
    const orders = await response.json();

    return NextResponse.json(orders.data?.contents, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "fail" },
      { status: 400 },
    );
  }
}
