require 'rails_helper'

describe 'JsonWT Authentication' do

  it 'does not authenticate requests without a proper authorization header' do
    get shows_path
    expect(response.status).to eq(401)
  end

  it 'does not authenticate requests with a bad authorization header' do
    get shows_path, nil, {'Authorization' => 'blahfoo'}
    expect(response.status).to eq(401)
  end

end
