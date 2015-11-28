class CertificationRecordForm extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hasName = this.hasName.bind(this);
    this.hasDate = this.hasDate.bind(this);
    this.valid = this.valid.bind(this);
    this.state = {certification_type: this.props.types[0], expiration_date: '', name: ''};
  }
  handleChange(e){
    this.setState({ [e.target.name]: e.target.value });
  }
  handleDateChange(date, name){
    this.setState({ [name]: date });
  }
  handleSubmit(e){
    e.preventDefault();
    $.ajax({
      url: '/certifications',
      method: 'POST',
      dataType: 'JSON',
      data: {certification: this.state }
    }).success(result => {
      this.props.handleNewRecord(result);
      this.setState({certification_type: this.props.types[0], expiration_date: '', name: ''});
    });
  }
  hasDate(){
    return this.state.certification_type !== 'Degree';
  }
  hasName(){
    return this.state.certification_type === 'Other' || this.state.certification_type === 'Degree';
  }
  valid(){
    return (this.hasDate() && this.state.expiration_date !== '' && this.state.certification_type !== 'Other') || (this.hasName() && this.state.name !== '');
  }
  render(){
    let selectOptions = this.props.types.map(type => {
      return(<option key={type}>{type}</option>);
    });
    return(
      <form className="form-horizontal col-md-4" onSubmit={this.handleSubmit}>
        <p className="lead text-center">Add Certification</p>
        <div className="form-group">
          <label className="control-label col-sm-4">Type</label>
          <div className="col-sm-8">
            <select className="form-control" name="certification_type" defaultValue={this.props.types[0]} onChange={this.handleChange}>
              {selectOptions}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-4">Name</label>
          <div className="col-sm-8">
            <input type="text" value={this.state.name} className="form-control" name='name' disabled={!this.hasName()} onChange={this.handleChange}></input>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-4">Expiration</label>
          <div className="col-sm-8">
            <Datepicker value={this.state.expiration_date} isValid={!this.hasDate()} refName="expiration_date" onDateChange={this.handleDateChange} />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-10 col-sm-offset-2">
            <button className="width-100 button button-sm" type="submit" disabled={!this.valid()}>Add</button>
          </div>
        </div>
      </form>
    );
  }
}
