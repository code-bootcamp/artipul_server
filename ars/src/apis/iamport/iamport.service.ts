import {
  ConflictException,
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  // getToken 및 에러 처리
  async getToken() {
    try {
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IAMPORT_IMP_KEY,
        imp_secret: process.env.IAMPORT_IMP_SECRET,
      });
      return result.data.response.access_token;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.responses.status,
      );
    }
  }

  // 결제 내역 확인 및 에러 처리
  async checkPaid({ impUid, charge_amount, token }) {
    try {
      const result = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      // status(아임포트제공)가 paid(결제완료) 상태인지 확인
      if (result.data.response.status !== 'paid')
        throw new ConflictException('결제 내역이 존재하지 않습니다');

      // 내가 충전한 금액과 결제된 금액이 같은지 확인
      if (result.data.response.amount !== charge_amount)
        throw new UnprocessableEntityException('결제 금액이 잘못되었습니다.');
    } catch (error) {
      console.log(error);
      // 아임포트에서 받은 에러메세지가 있을때
      if (error?.response?.data?.message) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        // 아임포트에서 받은 에러메서지가 없을때
        throw error;
      }
    }
  }

  // 아임포트 결제 취소 API
  async cancel({ impUid, token }) {
    try {
      const result = await axios.post(
        'https://api.iamport.kr/payments/cancel',
        { imp_uid: impUid },
        { headers: { Authorization: token } },
      );
      return result.data.response.cancel_amount;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.data.status,
      );
    }
  }
}
