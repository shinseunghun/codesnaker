import React, { Component } from 'react';
import {useNavigate, Link} from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import Swal from 'sweetalert2'

class ResearchProjectView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            before_algocode: props.match.params.algocode
        }
    }

    componentDidMount () {
        if(this.state.before_algocode == 'register'){
            $('.modifyclass').hide()
        }else{
            this.callAlgoInfoApi()
            $('.saveclass').hide()
        }
    }

    callAlgoInfoApi = async () => {
        axios.post('/api/Algo?type=list', {
            is_Algocode: this.state.before_algocode,
        })
        .then( response => {
            try {
                var data = response.data.json[0]
                $('#is_Algo_name').val(data.algo_name)
                $('#is_Algo_demo_site').val(data.algo_demo_site)
                $('#is_Algo_Giturl').val(data.algo_github_url)
                $('#is_Algo_Comments').val(data.algo_comments)
                $('#is_Algo_function').val(data.algo_function)
                var manualName = data.algo_manual_path.replace('/swmanual/','')
                var fileName = data.algo_big_imgpath.replace('/image/','')
                var fileName2 = data.algo_imagepath.replace('/image/','')
                $('#upload_img').prepend('<img id="uploadimg" src="'+data.algo_big_imgpath+'"/>')
                $('#upload_img2').prepend('<img id="uploadimg2" src="'+data.algo_imagepath+'"/>')

                $('#imagefile').val(fileName)
                $('#imagefile2').val(fileName2)
                $('#manualfile').val(manualName)

                if($('#uploadimg').attr('src').indexOf("null") > -1){
                    $('#uploadimg').hide()
                }
                if($('#uploadimg2').attr('src').indexOf("null") > -1){
                    $('#uploadimg2').hide()
                }
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.')
            }
        })
        .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    }

    submitClick = async (type, e) => {

        this.Algo_name_checker = $('#is_Algo_name').val();
        this.Algo_demo_site_checker = $('#is_Algo_demo_site').val();
        this.Algo_Giturl_checker = $('#is_Algo_Giturl').val();
        this.Algo_Comments_checker = $('#is_Algo_Comments').val();
        this.Algo_function_checker = $('#is_Algo_function').val();

        this.fnValidate = (e) => {
            if(this.Algo_name_checker === '') {
                $('#is_Algo_name').addClass('border_validate_err');
                alert('개발 언어를 다시 확인해주세요.')
                return false;
            }
            $('#is_Algo_name').removeClass('border_validate_err');

            if(this.Algo_demo_site_checker === '') {
                $('#is_Algo_demo_site').addClass('border_validate_err');
                alert('데모 URL을 다시 확인해주세요.')
                return false;
            }
            $('#is_Algo_demo_site').removeClass('border_validate_err');

            if(this.Algo_Giturl_checker === '') {
                $('#is_Algo_Giturl').addClass('border_validate_err');
                alert('Github URL을 다시 확인해주세요.')
                return false;
            }
            $('#is_Algo_Giturl').removeClass('border_validate_err');

            if(this.Algo_Comments_checker === '') {
                $('#is_Algo_Comments').addClass('border_validate_err');
                alert('설명을 다시 확인해주세요.')
                return false;
            }
            $('#is_Algo_Comments').removeClass('border_validate_err');

            if(this.Algo_function_checker === '') {
                $('#is_Algo_function').addClass('border_validate_err');
                alert('상세기능을 다시 확인해주세요.')
                return false;
            }
            $('#is_Algo_function').removeClass('border_validate_err');
            return true;
        }

        if(this.fnValidate()){
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi,'')
            Json_form = "{\"" +Json_form.replace(/\&/g,'\",\"').replace(/=/gi,'\":"')+"\"}";
        
            try {
                const response = await fetch('/api/Algo?type='+type, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: Json_form,
                });
                const body = await response.text();
                if(body == "succ"){
                    if(type == 'save'){
                        this.sweetalertSucc('알고리즘 문제 등록이 완료되었습니다.', false)
                    }
                    setTimeout(function() {
                        this.props.history.push('/ResearchProject');
                        }.bind(this),1500
                    );
                }else{
                    alert('작업중 오류가 발생하였습니다.')
                }  
            } catch (error) {
                alert('작업중 오류가 발생하였습니다.')
            }
        }
    };

    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    handleFileInput(type, e){
        if(type =='file'){
            $('#imagefile').val(e.target.files[0].name)
        }else if(type =='file2'){
            $('#imagefile2').val(e.target.files[0].name)
        }else if(type =='manual'){
            $('#manualfile').val(e.target.files[0].name)
        }
        this.setState({
          selectedFile : e.target.files[0],
        })
        setTimeout(function() {
            if(type =='manual'){
                this.handlePostMenual()
            }else{
                this.handlePostImage(type)
            }
        }.bind(this),1
        );
    }

    handlePostMenual(){
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        return axios.post("/api/upload?type=uploads/swmanual/", formData).then(res => {
            this.setState({menualName : res.data.filename})
            $('#is_MenualName').remove()
            $('#upload_menual').prepend('<input id="is_MenualName" type="hidden"'
            +'name="is_MenualName" value="/swmanual/'+this.state.menualName+'"}/>')
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.', error, 'error', '닫기')
        })
    }    

    handlePostImage(type){
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        return axios.post("/api/upload?type=uploads/image/", formData).then(res => {
            if(type =='file'){
                this.setState({fileName : res.data.filename})
                $('#is_MainImg').remove()
                $('#uploadimg').remove()
                $('#upload_img').prepend('<img id="uploadimg" src="/image/'
                +this.state.fileName+'"/>')
                $('#upload_img').prepend('<input id="is_MainImg" type="hidden"'
                +'name="is_MainImg" value="/image/'+this.state.fileName+'"}/>')
            }else if(type =='file2'){
                this.setState({fileName2 : res.data.filename})
                $('#is_LabelImg').remove()
                $('#uploadimg2').remove()
                $('#upload_img2').prepend('<img id="uploadimg2" src="/image/'
                +this.state.fileName2+'"/>')
                $('#upload_img2').prepend('<input id="is_LabelImg" type="hidden"'
                +'name="is_LabelImg" value="/image/'+this.state.fileName2+'"}/>')
            }
        }).catch(error => {
            alert('작업중 오류가 발생하였습니다.')            
        })
    }

    render () {
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">문제 등록/수정</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <input id="is_Algocode" type="hidden" name="is_Algocode" />
                            <input id="is_Email" type="hidden" name="is_Email" value="guest" />
                            <input id="is_beforeAlgocode" type="hidden" name="is_beforeAlgocode" value={this.state.before_algocode} />
                            <article class="res_w">
                                <p class="ment" style={{"text-align": "right"}}>
                                    <span class="red">(*)</span>표시는 필수입력사항 입니다.
                                </p>
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="is_Algo_name">언어<span class="red">(*)</span></label>
                                            </th>
                                            <td>
                                                <input type="text" name="is_Algo_name" id="is_Algo_name" class="" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Algo_demo_site">데모 URL<span class="red">(*)</span></label>
                                            </th>
                                            <td>
                                                <input type="text" name="is_Algo_demo_site" id="is_Algo_demo_site" class="" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Algo_Giturl">Github URL<span class="red">(*)</span></label>
                                            </th>
                                            <td>
                                                <input type="text" name="is_Algo_Giturl" id="is_Algo_Giturl" class="" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Algo_Comments">설명<span class="red">(*)</span></label>
                                            </th>
                                            <td>
                                                <textarea name="is_Algo_Comments" id="is_Algo_Comments" rows="" cols=""></textarea>
                                            </td>
                                        </tr>
                                        <tr class="div_tb_tr fileb">
                                            <th>
                                                해설지 파일 #1
                                            </th>
                                            <td class="fileBox fileBox_w1">
                                                <label for="uploadBtn1" class="btn_file">파일선택</label>
                                                <input type="text" id="manualfile" class="fileName fileName1" readonly="readonly" placeholder="선택된 파일 없음"/>
                                                <input type="file" id="uploadBtn1" class="uploadBtn uploadBtn1" onChange={e => this.handleFileInput('manual',e)}/>	
                                                <div id="upload_menual">
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                퀴즈 이미지
                                            </th>
                                            <td className="fileBox fileBox1">
                                                <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                                                <input type="text" id="imagefile" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음"/>
                                                <input type="file" id="imageSelect" className="uploadBtn uploadBtn1" onChange={e => this.handleFileInput('file',e)}/>
                                                <div id="upload_img">
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                정답 이미지
                                            </th>
                                            <td className="fileBox fileBox2">
                                                <label htmlFor='imageSelect2' className="btn_file">파일선택</label>
                                                <input type="text" id="imagefile2" className="fileName fileName1" readOnly="readonly" placeholder="선택된 파일 없음"/>
                                                <input type="file" id="imageSelect2" className="uploadBtn uploadBtn1" onChange={e => this.handleFileInput('file2',e)}/>
                                                <div id="upload_img2">
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Algo_function">상세 기능<span class="red">(*)</span></label>
                                            </th>
                                            <td>
                                                <textarea name="is_Algo_function" id="is_Algo_function" rows="" cols=""></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="btn_confirm mt20" style={{"margin-bottom": "44px"}}>
                                        <Link to={'/ResearchProject'} className="bt_ty bt_ty1 cancel_ty1">취소</Link>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass" onClick={(e) => this.submitClick('save', e)}>저장</a>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 modifyclass" onClick={(e) => this.submitClick('modify', e)}>수정</a>
                                    </div>
                                </div>
                            </article>
                        </form>	
                    </div> 
                </article>
            </section>
        );
    }
}

export default ResearchProjectView;