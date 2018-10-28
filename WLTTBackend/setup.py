"""python package configuration."""

from setuptools import setup

setup(
    name='WLTTBackend',
    version='0.1.0',
    packages=['WLTTBackend'],
    include_package_data=True,
    install_requires=[
        'flask',
        'arrow',
        'sh',
        'simplejson',
    ],
)
