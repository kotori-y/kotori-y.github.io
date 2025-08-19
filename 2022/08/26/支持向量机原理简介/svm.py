import numpy as np
from numpy.typing import ArrayLike


def linear_kernel(xi: np.matrix, xj: np.matrix):
    assert xi.shape[0] == xj.shape[0]
    assert xi.shape[1] == xj.shape[1] == 1

    return xi.T * xj


class SVMClassifier:

    def __init__(self, gamma: float, kernel: str):
        self._C = np.mat([[gamma]])
        self._kernel = kernel
        self._alphas = None
        self._b = None
        self._w = None

    @property
    def C(self):
        return self._C

    @property
    def kernel(self):
        return self._kernel

    @property
    def alphas(self):
        return self._alphas

    @property
    def b(self):
        return self._b

    @property
    def w(self):
        return self._w

    def random_choose_index_j(self, i, m):
        j = np.random.randint(0, m)
        if j == i:
            return self.random_choose_index_j(i, m)
        return j

    def calculate_low_and_high(self, alpha_i_old, alpha_j_old, y_i, y_j):

        if y_i != y_j:
            low = max(np.mat([[0]]), alpha_j_old - alpha_i_old)
            high = min(self.C, self.C + alpha_j_old - alpha_i_old)

            return low, high

        low = max(np.mat([[0]]), alpha_j_old + alpha_i_old - self.C)
        high = min(self.C, alpha_j_old + alpha_i_old)

        return low, high

    def kernel_func(self, *args):
        if self.kernel == "linear":
            return linear_kernel(*args)

    def _gx(self, X_mat, y_mat, i):
        return np.multiply(self.alphas, y_mat).T * (X_mat * X_mat[i, :].T) + self.b

    def calculate_eta(self, X_i, X_j):

        k_ii = self.kernel_func(X_i, X_i)
        k_jj = linear_kernel(X_j, X_j)
        k_ij = linear_kernel(X_i, X_j)

        return k_ii + k_jj - 2 * k_ij

    def clip_alpha(self, alpha, low, high):
        if low <= alpha <= high:
            return alpha

        if alpha < low:
            return low

        return high

    def fit(self, X_train: ArrayLike, y_train: ArrayLike, epochs):
        m, n = X_train.shape

        self._alphas = np.mat(np.zeros((m, 1)))
        self._b = np.mat([[0]])

        X_mat = np.mat(X_train)
        y_mat = np.mat(y_train.reshape(-1, 1))

        for epoch in range(epochs):
            for i in range(m):
                gx_i = self._gx(X_mat, y_mat, i)
                ex_i = gx_i - y_mat[i, :]

                j = self.random_choose_index_j(i, m)
                gx_j = self._gx(X_mat, y_mat, j)
                ex_j = gx_j - y_mat[j, :]

                y_i = y_mat[i, :]
                y_j = y_mat[j, :]
                X_i = X_mat[i, :].T
                X_j = X_mat[j, :].T
                alpha_i_old = self.alphas[i, :]
                alpha_j_old = self.alphas[j, :]

                eta = self.calculate_eta(X_i, X_j)
                if eta <= 0:
                    continue

                _alpha_j = alpha_j_old + (y_j * (ex_i - ex_j)) / eta

                low, high = self.calculate_low_and_high(alpha_i_old, alpha_j_old, y_i, y_j)

                alpha_j_new = self.clip_alpha(_alpha_j, low=low, high=high)
                alpha_i_new = alpha_i_old + y_i * y_j * (alpha_j_old - alpha_j_new)

                b1 = - ex_i - y_i * linear_kernel(X_i, X_i) * (alpha_i_new - alpha_i_old) - \
                     y_j * linear_kernel(X_j, X_i) * (alpha_j_new - alpha_j_old) + self.b

                b2 = - ex_j - y_i * linear_kernel(X_i, X_j) * (alpha_i_new - alpha_i_old) - \
                     y_j * linear_kernel(X_j, X_j) * (alpha_j_new - alpha_j_old) + self.b

                if np.mat([[0]]) < alpha_i_new < self.C:
                    self._b = b1
                elif np.mat([[0]]) < alpha_j_new < self.C:
                    self._b = b2
                else:
                    self._b = (b1 + b2) / 2

                self._alphas[i, 0] = alpha_i_new
                self._alphas[j, 0] = alpha_j_new

        self._w = np.multiply(self.alphas, y_mat).T * X_mat


if __name__ == "__main__":
    from sklearn.datasets import load_iris
    import matplotlib.pyplot as plt

    iris = load_iris()
    _X_train, _y_train = iris.data[:, :2], iris.target
    _X_train = _X_train[_y_train != 2]
    _y_train = _y_train[_y_train != 2]
    _y_train = np.where(_y_train == 0, -1, 1)

    model = SVMClassifier(gamma=10, kernel="linear")
    model.fit(_X_train, _y_train, 500)

    fig, ax = plt.subplots()
    ax.scatter(*_X_train[_y_train == 1].T, s=25)
    ax.scatter(*_X_train[_y_train == -1].T, s=25)

    w_0, w_1 = np.array(model.w).flatten()
    # w_0 * X_0 + w_1 * X_1 + b = 0
    # => w_1 * X_1 = - (b +  w_0 * X_0)
    # => X_1 = - (b +  w_0 * X_0) / w_1
    x_0 = np.arange(4, 7, 0.01)
    x_1 = - (model.b[0, 0] + w_0 * x_0) / w_1

    # support vec
    x_1_p = (- (model.b[0, 0] + w_0 * x_0) + 1) / w_1
    x_1_n = (- (model.b[0, 0] + w_0 * x_0) - 1) / w_1

    ax.plot(x_0, x_1, color='k', lw=1)
    ax.plot(x_0, x_1_p, color='k', lw=1, ls='--')
    ax.plot(x_0, x_1_n, color='k', lw=1, ls='--')

    support = _X_train[np.array(model.alphas != 0).flatten()]
    ax.scatter(*support.T, s=100, color='m', zorder=-1, label='support vector')

    ax.legend()
    plt.show()

    print("DONE")
