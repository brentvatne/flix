class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  skip_before_filter :verify_authenticity_token

  def current_user
    @current_user ||= begin
      user = User.where(email: params[:email]).first_or_create
    end
  end

  # Disable the root node, eg: {projects: [{..}, {..}]}
  def default_serializer_options
    {root: false}
  end

  before_filter :parse_out_preferences
  def parse_out_preferences
    if params[:preferences].present?
      params[:preferences] = JSON.parse(params[:preferences])
    end
  end

  # Convert lowerCamelCase params to snake_case automatically
  before_filter :deep_snake_case_params!
  def deep_snake_case_params!(val = params)
    case val
    when Array
      val.map {|v| deep_snake_case_params! v }
    when Hash
      val.keys.each do |k, v = val[k]|
        val.delete k
        val[k.underscore] = deep_snake_case_params!(v)
      end
      val
    else
      val
    end
  end
end
