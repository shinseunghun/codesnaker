import React, { Component } from 'react';

class Userwinner extends Component {
    render () {
        return (
            <section className="sub_wrap" >
                <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div className="li_top">
                        <h2 className="s_tit1">우수 사용자 랭킹</h2>
                        <div className="li_top_sch af">
                        </div>
                    </div>

                    <div className="list_cont list_cont_admin">
                        <table className="table_ty1 ad_tlist">
                            <tr>
                                <th>랭킹</th>
                                <th>사용자 이름</th>
                                <th>리워드 보상금</th>
                            </tr>
                        </table>	
                        <table className="table_ty2 ad_tlist">
                        </table>
                    </div>
                </article>
            </section>
        );
    }
}

export default Userwinner;