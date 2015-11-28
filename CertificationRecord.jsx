class CertificationRecord extends React.Component {
  constructor(props){
    super(props);
    this.onEditClick = this.onEditClick.bind(this);
    this.hasName = this.hasName.bind(this);
    this.hasDate = this.hasDate.bind(this);
    this.valid = this.valid.bind(this);
    this.getDate = this.getDate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.defaultRender = this.defaultRender.bind(this);
    this.formRender = this.formRender.bind(this);
    this.state = {edit: false};
  }
  onEditClick(){
    this.setState({edit: !this.state.edit});
  }
  hasName(){
    return this.props.record.certification_type === 'Other' || this.props.record.certification_type === 'Degree';
  }
  hasDate(){
    return this.props.record.certification_type !== 'Degree';
  }
  valid(){
    return this.props.record.certification_type;
  }
  getDate(date, name){
    this.newDate = date ;
  }
  handleUpdate(e){
    e.preventDefault();
    let date = this.hasDate() ? (this.newDate.length ? this.newDate : this.props.record.expiration_date) : '';
    let name = this.hasName() ? React.findDOMNode(this.refs.name).value : '';
    let data = {
      certification_type: this.props.record.certification_type,
      expiration_date: date,
      name: name
    };
    $.ajax({
      url: `/certifications/${this.props.record.id}`,
      method: 'PUT',
      dataType: 'JSON',
      data: { certification: data }
    }).success(result => {
      this.setState({edit: false});
      this.props.handleEditCert(this.props.record, result);
    });
  }
  onDeleteClick(e){
    e.preventDefault();
    bootbox.confirm("Are you sure you would like to delete this record?", (result => {
      if(result){
        $.ajax({
          url: `/certifications/${this.props.record.id}`,
          method: 'DELETE',
          dataType: 'JSON',
        }).success(() => {
          this.props.handleDeleteCert(this.props.record);
        });
      }
    }));
  }
  defaultRender(){
    return(
      <tr>
        <td>{this.props.record.certification_type}</td>
        <td>{this.props.record.expiration_date}</td>
        <td>{this.props.record.name}</td>
        <td>
          <button className="button button-xs show_tool_tips" onClick={this.onEditClick} style={{marginRight: 5}} data-toggle="tooltip" title="Edit">
            <i className="fa fa-pencil fa-lg white"></i>
          </button>
          <button className="button button-xs button-default show_tool_tips" onClick={this.onDeleteClick} data-toggle="tooltip" title="Remove">
            <i className="fa fa-trash-o fa-lg white"></i>
          </button>
        </td>
      </tr>
    );
  }
  formRender(){
    let nameInput = this.hasName() ? (<input className="form-control" type="text" defaultValue={this.props.record.name} ref="name"></input>) : '';
    let dateInput = this.hasDate() ? (<Datepicker value={this.props.record.expiration_date} refName="expiration_date" onDateChange={this.getDate} />) : '';
    return(
      <tr>
        <td name={this.props.record.certification_type} ref="certification_type">{this.props.record.certification_type}</td>
        <td>
          {dateInput}
        </td>
        <td>
          {nameInput}
        </td>
        <td>
          <button className="button button-xs show_tool_tips" onClick={this.handleUpdate} disabled={!this.valid()} style={{marginRight: 5}} data-toggle="tooltip" title="Save">
            <i className="fa fa-check fa-lg white"></i>
          </button>
          <button className="button button-xs button-default show_tool_tips" onClick={this.onEditClick} data-toggle="tooltip" title="Cancel">
            <i className="fa fa-times fa-lg white"></i>
          </button>
        </td>
      </tr>
    );
  }
  render(){
    if(this.state.edit){
      return(this.formRender());
    }
    return(this.defaultRender());
  }
}
