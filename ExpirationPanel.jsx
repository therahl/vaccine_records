class ExpirationPanel extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let list = this.props.expiration.map(item => {
      return(<li><div className="col-xs-6">{item.certification_type}</div><div className="col-xs-6">{item.expiration_date}</div></li>)
    });
    return(
      <div className={`panel record-panel panel-danger panel-${this.props.expiration.length}`}>
        <div className="panel-heading">
          <h4 className="text-center">{this.props.title}</h4>
        </div>
          <div className="panel-body">
            <ul className="list-unstyled">{list}</ul>
          </div>
      </div>
    );
  }
}
