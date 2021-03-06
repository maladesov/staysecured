const jwt = require('jsonwebtoken');
const TokenModel = require('./model');
const UserModel = require('../user/model');
const UserDTO = require('../user/dto');

// Небольшая функция для быстрой генерации токена с нужными настройками
const createToken = (payload, kind) => {
  return jwt.sign(payload, API_CONFIG.jwt[`${kind}_token_secret`], {
    expiresIn: API_CONFIG.jwt[`${kind}_token_lifetime`],
  });
};

class Tokens {
  static generateTokens(payload) {
    const accessToken = createToken(payload, 'access');
    const refreshToken = createToken(payload, 'refresh');

    return { accessToken, refreshToken };
  }

  static async registerUserTokens(userModel) {
    const defaultUserDTO = UserDTO.Default(userModel);
    const tokens = Tokens.generateTokens(defaultUserDTO);
    await Tokens.saveRefreshToken(defaultUserDTO.id, tokens.refreshToken);

    return {
      ...tokens,
      user: defaultUserDTO,
    };
  }

  static async validateAccessToken(token) {
    try {
      const jwtData = jwt.verify(token, API_CONFIG.jwt.access_token_secret);
      if (!jwtData) return null;

      const userData = await UserModel.findById(jwtData.id);
      if (!userData) return null;

      return { jwt: jwtData, user: userData };
    } catch (e) {
      return null;
    }
  }

  static async validateRefreshToken(token) {
    try {
      const verifiedJWT = jwt.verify(token, API_CONFIG.jwt.refresh_token_secret);
      if (!verifiedJWT) return null;

      const jwtData = await TokenModel.findOne({ user: verifiedJWT.id });
      if (!jwtData) return null;

      const userData = await UserModel.findById(jwtData.user);
      if (!userData) return null;

      return { jwt: jwtData, user: userData };
    } catch (e) {
      return null;
    }
  }

  static async saveRefreshToken(user, refreshToken) {
    const tokenData = await TokenModel.findOne({ user });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    return TokenModel.create({ user, refreshToken });
  }

  static async removeRefreshToken(refreshToken) {
    return TokenModel.deleteOne({ refreshToken });
  }

  static async getRefreshToken(refreshToken) {
    return TokenModel.findOne({ refreshToken });
  }
}

module.exports = Tokens;
