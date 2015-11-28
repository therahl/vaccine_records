class VaccinationRecord extends React.Component {
  constructor(props){
    super(props);
    this.onEditClick = this.onEditClick.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.defaultRender = this.defaultRender.bind(this);
    this.formRender = this.formRender.bind(this);
    this.state = {edit: false};
  }
  onEditClick(){
    this.setState({edit: !this.state.edit});
  }
  handleUpdate(){
    let data = {
      name: this.props.record.name,
      expiration_date: this.state.expiration_date ? this.state.expiration_date : this.props.record.expiration_date,
      administration_date: this.state.administration_date ? this.state.administration_date : this.props.record.administration_date
    };
    $.ajax({
      url: `/vaccines/${this.props.record.id}`,
      method: 'PUT',
      data: {vaccine: data},
      dataType: 'JSON'
    }).success(result => {
      this.setState({edit: false});
      this.props.handleEditVaccine(this.props.record, result);
    });
  }
  handleDateChange(date, name){
    this.setState({ [name]: date });
  }
  onDeleteClick(e){
    bootbox.confirm("Are you sure you would like to delete this record?", (result => {
      if(result){
        $.ajax({
          url: `/vaccines/${this.props.record.id}`,
          method: 'DELETE',
          dataType: 'JSON'
        }).success(data => {
          this.props.handleDeleteVaccine(this.props.record);
        });
      }
    }));
  }
  defaultRender(){
    return(
      <tr>
        <td>{this.props.record.name}</td>
        <td>{this.props.record.administration_date}</td>
        <td>{this.props.record.expiration_date}</td>
        <td>
          <button className="button button-xs show_tool_tips" onClick={this.onEditClick} style={{marginRight: 5}} data-toggle='tooltip' title="Edit"><i className="fa fa-pencil fa-lg white"></i></button>
          <button className="button button-default button-xs show_tool_tips" onClick={this.onDeleteClick} data-toggle='tooltip' title="Remove"><i className="fa fa-trash-o fa-lg white"></i></button>
        </td>
      </tr>
    );
  }
  formRender(){
    return(
      <tr>
        <td>{this.props.record.name}</td>
        <td><Datepicker value={this.props.record.expiration_date} refName='expiration_date' onDateChange={this.handleDateChange} /></td>
        <td><Datepicker value={this.props.record.administration_date} refName='administration_date' onDateChange={this.handleDateChange} /></td>
        <td>
          <button className="button button-xs show_tool_tips" onClick={this.handleUpdate} style={{marginRight: 5}} data-toggle='tooltip' title="Save"><i className="fa fa-check fa-lg white"></i></button>
          <button className="button button-default button-xs show_tool_tips" onClick={this.onEditClick} data-toggle='tooltip' title="Cancel"><i className="fa fa-times fa-lg white"></i></button>
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
