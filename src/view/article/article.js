import React, { Component } from "react";
import {connect} from "react-redux"
import { Divider } from "antd";
import Loading from "../../components/Loading";
import author_img from "../../assets/author.svg";
import time_img from "../../assets/time.svg";
import comment_img from "../../assets/comment.svg";
import { translateMarkdown } from "../../util/util";
import "./article.scss";

import Anchor from "./anchor";
import api from "../../api/api";
 class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      loading: true,
      id: ""
    };
  }
  componentDidMount() {
    var id = this.props.match.params.id;
    this.getArticle(id);
  }
  componentWillReceiveProps(nextprops) {
    var id = nextprops.match.params.id;
    if (id === this.state.id) {
      return;
    }
    this.getArticle(id);
  }
  getArticle(id){
    this.setState({
      loading: true
    });
    api
      .post("article/getArticle", {
        id: id
      })
      .then(res => {
        this.setState({
          id: id,
          article: res.data,
          loading: false
        });
      });
  };

  render() {
    let { article, loading } = this.state;
    let content;
    if (article) {
      content = translateMarkdown(article.content);
    }
    // markdown-body editormd-html-preview
    return loading ? (
      <Loading />
    ) : (
      <div className="article-Wrapper">
        <div className="content_left">
          <div className="content_header">
            <div className="">{article.title}</div>
            <div className="articleInfo">
              <div className="item">
                <img alt="" src={author_img} />
                <span>{article.author}</span>
              </div>
              <div className="item">
                <img alt="" src={time_img} />
                <span>{article.updateTime.slice(0, 10)}</span>
              </div>
              <div className="item">
                <img alt="" src={comment_img} />
                <span>暂无评论</span>
              </div>
            </div>
          </div>

          <div className="article-detail" style={{paddingLeft:40,paddingRight:40}}  dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>

          <div className="sider_left">
            <Divider orientation="left">总览</Divider>
            <Anchor content={content} />
          </div>
      </div>
    );
  }
}
export default connect(state=>({windowWidth:state.common.windowWidth}))(Article)
