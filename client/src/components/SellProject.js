import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2'

class SellProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            responseAlgoList: '',
            append_AlgoList: '',
        }
    }

    componentDidMount() {
        this.callAlgoListApi()
    }

    callAlgoListApi = async () => {
        axios.post('/api/Algo?type=list', {
        })
        .then( response => {
            try {
                this.setState({ responseAlgoList: response });
                this.setState({ append_AlgoList: this.AlgoListAppend() });
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    AlgoListAppend = () => {
        let result = []
        var AlgoList = this.state.responseAlgoList.data
        
        for(let i=0; i<AlgoList.json.length; i++){
            var data = AlgoList.json[i]

            var date = data.reg_date
            var year = date.substr(0,4)
            var month = date.substr(4,2)
            var day = date.substr(6,2)
            var reg_date = year +'.'+month+'.'+day

            result.push(
                <tr className="hidden_type">
                    <td>{data.algo_code}</td>
                    <td><Link to={'/SellProjectView/'+data.algo_code}>{data.algo_function}</Link></td>
                    <td>{reg_date}</td>
                    <td>{data.algo_name}</td>
                    <td>
                        <Link to={'/SellProjectView/'+data.algo_code} 
                        className="bt_c1 bt_c2 w50_b">구매</Link>
                         <a href="#n" class="bt_c1 w50_b" id={data.algo_code}
                        onClick={(e) => this.deleteAlgo(e)}>취소</a>
                    </td>
                </tr>
            )
        }
        return result
    }

    deleteAlgo = (e) => {
        var event_target = e.target
        this.sweetalertDelete('정말 삭제하시겠습니까?', function() {
            axios.post('/api/Algo?type=delete', {
                is_AlgoCd : event_target.getAttribute('id')
            })
            .then( response => {
                this.callAlgoListApi()
            }).catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
        }.bind(this))
    }

    sweetalertDelete = (title, callbackFunc) => {
        Swal.fire({
            title: title,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Deleted!',
                '삭제되었습니다.',
                'success'
              )
            }else{
                return false;
            }
            callbackFunc()
          })
    }

    render () {
        return (
            <section className="sub_wrap" >
                <article className="s_cnt mp_pro_li ct1 mp_pro_li_admin">
                    <div className="li_top">
                        <h2 className="s_tit1">추천 알고리즘 구매</h2>
                        <div className="li_top_sch af">
                        <Link to={'/SellProjectView/register'} className="sch_bt2 wi_au">문제 구매</Link>
                        </div>
                    </div>

                    <div className="list_cont list_cont_admin">
                        <table className="table_ty1 ad_tlist">
                            <tr>
                                <th>no.</th>
                                <th>문제 제목</th>
                                <th>등록일</th>
                                <th>작성자</th>
                                <th>기능</th>
                            </tr>
                        </table>	
                        <table className="table_ty2 ad_tlist">
                            {this.state.append_AlgoList}
                        </table>
                    </div>
                </article>
            </section>
        );
    }
}

export default SellProject;