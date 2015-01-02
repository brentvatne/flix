class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # protect_from_forgery with: :exception
  skip_before_filter :verify_authenticity_token
  before_action :validate_token

  def current_user
    @current_user ||= begin
      user = User.where(auth_id: decoded_token[0]["sub"]).first_or_create
    end
  end

  helper_method :current_user

  class InvalidTokenError < StandardError; end

  private

  def decoded_token
    @decoded_token ||= decode_token
  end

  def decode_token
    authorization = request.headers['Authorization']
    raise InvalidTokenError if authorization.nil?

    token = authorization.split(' ').last
    JWT.decode(token,
      JWT.base64url_decode(Rails.application.secrets.auth0_client_secret)
     )
  end

  def validate_token
    begin
      raise InvalidTokenError if Rails.application.secrets.auth0_client_id != decoded_token[0]["aud"]
    rescue JWT::DecodeError, InvalidTokenError
      render(text: "Unauthorized", status: :unauthorized) and return
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
